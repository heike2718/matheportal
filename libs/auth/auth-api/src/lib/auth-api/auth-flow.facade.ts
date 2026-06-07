import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSessionFacade } from './auth-session.facade';
import { authActions } from '@matheportal/auth-data';
import { AUTH_LOCATION_HASH, mapHashToAuthResult } from '@matheportal/auth-model';

@Injectable({
    providedIn: 'root',
})
export class AuthFlowFacade {
    #store = inject(Store);
    #authSessionFacade = inject(AuthSessionFacade);
    #authLocationHash = inject(AUTH_LOCATION_HASH);

    login(): void {
        this.#store.dispatch(authActions.requestLoginUrl());
    }

    logout(): void {
        this.#store.dispatch(authActions.logOut());
    }

    initClearOrRestoreSession(): void {
        const hash = this.#authLocationHash();
        const authResult = mapHashToAuthResult(hash);

        if (authResult === null) {
            this.#authSessionFacade.validateSession();
            return;
        }

        switch (authResult.state) {
            case 'invalid': {
                this.#handleInvalidOAuthFlowHash();
                break;
            }
            case 'login': {
                if (!authResult.idToken) {
                    this.#handleLoginMissingIdToken();
                } else {
                    this.#store.dispatch(authActions.createSession({ idToken: authResult.idToken }));
                }
                break;
            }
            case 'signup':
                // hier erstmal noch nicht klar, was passieren soll.
                break;
        }
    }

    /**
     * wird vom authExpiredInterceptor aufgerufen
     */
    handleSessionExpired(): void {
        this.#store.dispatch(authActions.sessionValidationFailed({ reason: 'expired' }));
    }

    #handleLoginMissingIdToken(): void {
        // TODO: exception handling - also das hier ans backend senden.
        console.error('initClearOrRestoreSession: login with missing idToken');
        this.#store.dispatch(authActions.createSessionFailed());
    }

    #handleInvalidOAuthFlowHash(): void {
        // TODO: exception handling - also das hier ans backend senden.
        this.#store.dispatch(authActions.invalidOAuthFlowHash());
    }
}
