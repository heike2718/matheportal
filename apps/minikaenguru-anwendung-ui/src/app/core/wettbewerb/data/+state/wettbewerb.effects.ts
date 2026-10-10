import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WettbewerbHttpService } from '../wettbewerb-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { WettbewerbActions } from './wettbewerb.actions';
import { catchError, exhaustMap, filter, map, of, tap, withLatestFrom } from 'rxjs';
import { mapErrorToMessage } from '@matheportal/shared-utils';
import { Store } from '@ngrx/store';
import { fromWettbewerb } from './wettbewerb.selectors';

@Injectable()
export class WettbewerbEffects {
    #actions = inject(Actions);
    #httpService = inject(WettbewerbHttpService);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #store = inject(Store);

    readonly ensureWettbewerbGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(WettbewerbActions.ensureWettbewerbGeladen),
            withLatestFrom(this.#store.select(fromWettbewerb.selectWettbewerbLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(() => WettbewerbActions.wettbewerbLaden())
        )
    );

    readonly wettbewerbLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(WettbewerbActions.wettbewerbLaden),
            withLatestFrom(this.#store.select(fromWettbewerb.selectWettbewerbLoaded)),
            filter(([_, loaded]) => !loaded),
            exhaustMap(() =>
                this.#httpService.loadWettbewerb().pipe(
                    map(wettbewerb => WettbewerbActions.wettbewerbGeladen({ wettbewerb })),
                    catchError((error: Error) => of(WettbewerbActions.wettbewerbLadenFailed({ error })))
                )
            )
        );
    });

    readonly wettbewerbLadenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(WettbewerbActions.wettbewerbLadenFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisher.publishError(errorMessage);
                })
            ),
        { dispatch: false }
    );
}
