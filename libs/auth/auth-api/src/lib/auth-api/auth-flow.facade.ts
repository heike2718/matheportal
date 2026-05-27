import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSessionFacade } from './auth-session.facade';
import { authActions } from '@matheportal/auth-data';
import { mapHashToAuthResult } from '@matheportal/auth-model';

@Injectable({
    providedIn: 'root',
})
export class AuthFlowFacade {
    #store = inject(Store);
    #authSessionFacade = inject(AuthSessionFacade);

    login(): void {
        this.#store.dispatch(authActions.requestLoginUrl());
    }

    logout(): void {
        this.#store.dispatch(authActions.logOut());
    }

    initClearOrRestoreSession(): void {
        const hash = window.location.hash;
        const authResult = mapHashToAuthResult(hash);

        if (authResult.state === 'login') {
            if (authResult.idToken) {
                this.#store.dispatch(authActions.createSession({ idToken: authResult.idToken }));
            } else {
                this.#store.dispatch(authActions.createSessionFailed());
            }
        } else {
            this.#authSessionFacade.validateSession();
        }
    }

    /**
     * wird vom authExpiredInterceptor aufgerufen
     */
    handleSessionExpired(): void {
        this.#store.dispatch(authActions.sessionValidationFailed({ reason: 'expired' }));
    }
}
