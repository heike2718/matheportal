import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WettbewerbHttpService } from '../wettbewerb-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { wettbewerbActions } from './wettbewerb.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { mapErrorToMessage } from '@matheportal/shared-utils';

@Injectable()
export class WettbewerbEffects {
    #actions = inject(Actions);
    #httpService = inject(WettbewerbHttpService);
    #messagePublisher = inject(MESSAGE_PUBLISHER);

    readonly loadWettbewerb$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(wettbewerbActions.loadWettbewerb),
            switchMap(() =>
                this.#httpService.loadWettbewerb().pipe(
                    map(wettbewerb => wettbewerbActions.wettbewerbLoaded({ wettbewerb })),
                    catchError((error: Error) => of(wettbewerbActions.loadWettbewerbFailed({ error })))
                )
            )
        );
    });

    readonly loadWettbewerbFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(wettbewerbActions.loadWettbewerbFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisher.publishError(errorMessage);
                })
            ),
        { dispatch: false }
    );
}
