import { inject, Injectable } from '@angular/core';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MkaAuthorizationHttpService } from '../mka-authorization-http.service';
import { MkaAuthorizationActions } from './mka-authorization.actions';
import { catchError, exhaustMap, filter, map, of, take, tap, withLatestFrom } from 'rxjs';
import { User } from '@matheportal/auth-model';
import { TECHNISCHER_FEHLER_MESSAGE } from '@matheportal/shared-model';
import { Store } from '@ngrx/store';
import { fromMkaAuthorization } from './mka-authorization.selectors';
import { AuthSessionFacade, sessionState } from '@matheportal/auth-api';

@Injectable()
export class MkaAuthorizationEffects {
    #actions = inject(Actions);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #httpService = inject(MkaAuthorizationHttpService);
    #store = inject(Store);
    #authSessionFacade = inject(AuthSessionFacade);

    readonly ensureMkaAuthorizationLoaded$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(MkaAuthorizationActions.ensureMkaAuthorizationLoaded),
            exhaustMap(() =>
                this.#store.select(sessionState).pipe(
                    filter(loadState => loadState !== 'not-loaded'),
                    take(1),
                    filter(loadState => loadState === 'loaded'),
                    map(() => MkaAuthorizationActions.loadMkaAuthorization())
                )
            )
        );
    });

    loadMkaAuthorization$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(MkaAuthorizationActions.loadMkaAuthorization),
            withLatestFrom(this.#store.select(fromMkaAuthorization.authorizationLoadState)),
            filter(([, LoadState]) => LoadState === 'not-loaded'),
            exhaustMap(() =>
                this.#httpService.loadMkaAuthorization().pipe(
                    map((user: User) => MkaAuthorizationActions.mkaAuthorizationLoaded({ user })),
                    catchError(() => of(MkaAuthorizationActions.loadMkaAuthorizationFailed()))
                )
            )
        );
    });

    mkaAuthorizationLoaded$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(MkaAuthorizationActions.mkaAuthorizationLoaded),
                tap(action => {
                    this.#authSessionFacade.synchronizeUser(action.user);
                })
            ),
        { dispatch: false }
    );

    loadMkaAuthorizationFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(MkaAuthorizationActions.loadMkaAuthorizationFailed),
                tap(() => {
                    this.#messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
                })
            ),
        { dispatch: false }
    );
}
