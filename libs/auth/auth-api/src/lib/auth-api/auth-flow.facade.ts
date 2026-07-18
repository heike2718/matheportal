import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSessionFacade } from './auth-session.facade';
import { authActions } from '@matheportal/auth-data';
import { LOCATION_HASH_SERVICE } from '@matheportal/auth-data';
import { mapHashToAuthResult } from './utils/auth-api.utils';
@Injectable({
    providedIn: 'root',
})
export class AuthFlowFacade {
    #store = inject(Store);
    #authSessionFacade = inject(AuthSessionFacade);
    #locationHashService = inject(LOCATION_HASH_SERVICE);

    login(): void {
        this.#store.dispatch(authActions.requestLoginUrl());
    }

    signup(): void {
        this.#store.dispatch(authActions.requestSignupUrl());
    }

    logout(): void {
        this.#store.dispatch(authActions.logOut());
    }

    initClearOrRestoreSession(): void {
        const hash = this.#locationHashService.read();
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
                this.#store.dispatch(authActions.signedUp());
                break;
        }
    }

    #handleLoginMissingIdToken(): void {
        // TODO: exception handling - also das hier ans backend senden.
        this.#store.dispatch(authActions.createSessionFailed());
    }

    #handleInvalidOAuthFlowHash(): void {
        // TODO: exception handling - also das hier ans backend senden.
        this.#store.dispatch(authActions.invalidOAuthFlowHash());
    }
}
