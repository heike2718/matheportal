import { inject, Injectable } from '@angular/core';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MkaAuthorizationHttpService } from '../mka-authorization-http.service';
import { mkaAuthorizationActions } from './mka-authorization.actions';
import { catchError, exhaustMap, filter, map, of, tap, withLatestFrom } from 'rxjs';
import { User } from '@matheportal/auth-model';
import { TECHNISCHER_FEHLER_MESSAGE } from '@matheportal/shared-utils';
import { Store } from '@ngrx/store';
import { fromMkaAuthorization } from './mka-authorization.selectors';
import { AuthSessionFacade } from '@matheportal/auth-api';

@Injectable()
export class MkaAuthorizationEffects {
    #actions = inject(Actions);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #httpService = inject(MkaAuthorizationHttpService);
    #store = inject(Store);
    #authSessionFacade = inject(AuthSessionFacade);

    loadMkaAuthorization$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(mkaAuthorizationActions.loadMkaAuthorization),
            withLatestFrom(this.#store.select(fromMkaAuthorization.authorizationLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded'),
            exhaustMap(() =>
                this.#httpService.loadMkaAuthorization().pipe(
                    map((user: User) => mkaAuthorizationActions.mkaAuthorizationLoaded({ user })),
                    catchError(() => of(mkaAuthorizationActions.loadMkaAuthorizationFailed()))
                )
            )
        );
    });

    mkaAuthorizationLoaded$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(mkaAuthorizationActions.mkaAuthorizationLoaded),
                tap(action => {
                    this.#authSessionFacade.synchronizeUser(action.user);
                })
            ),
        { dispatch: false }
    );

    loadMkaAuthorizationFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(mkaAuthorizationActions.loadMkaAuthorizationFailed),
                tap(() => {
                    this.#messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
                })
            ),
        { dispatch: false }
    );
}
