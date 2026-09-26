import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WettbewerbHttpService } from '../wettbewerb-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { wettbewerbActions } from './wettbewerb.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { mapErrorToMessage } from '@matheportal/shared-utils';
import { mkaAuthorizationLoaded } from '../../../authorization/authorization-api/mka-authorization-store.events';

@Injectable()
export class WettbewerbEffects {
    #actions = inject(Actions);
    #httpService = inject(WettbewerbHttpService);
    #messagePublisher = inject(MESSAGE_PUBLISHER);

    wettbewerbLadenOnAuthorizationLoaded$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(mkaAuthorizationLoaded),
            map(() => wettbewerbActions.wettbewerbLaden())
        );
    });

    readonly wettbewerbLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(wettbewerbActions.wettbewerbLaden),
            switchMap(() =>
                this.#httpService.loadWettbewerb().pipe(
                    map(wettbewerb => wettbewerbActions.wettbewerbGeladen({ wettbewerb })),
                    catchError((error: Error) => of(wettbewerbActions.wettbewerbLadenFailed({ error })))
                )
            )
        );
    });

    readonly wettbewerbLadenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(wettbewerbActions.wettbewerbLadenFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisher.publishError(errorMessage);
                })
            ),
        { dispatch: false }
    );
}
