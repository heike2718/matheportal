import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PortalSessionFacade } from './portal-session.facade';
import { AuthActions } from '@matheportal/auth-data';
import { LOCATION_HASH_SERVICE } from '@matheportal/auth-data';
import { mapHashToAuthResult } from './utils/auth-api.utils';
@Injectable({
    providedIn: 'root',
})
export class AuthFlowFacade {
    #store = inject(Store);
    #portalSessionFacade = inject(PortalSessionFacade);
    #locationHashService = inject(LOCATION_HASH_SERVICE);

    login(): void {
        this.#store.dispatch(AuthActions.requestLoginUrl());
    }

    signup(): void {
        this.#store.dispatch(AuthActions.requestSignupUrl());
    }

    logout(): void {
        this.#store.dispatch(AuthActions.logOut());
    }

    initClearOrRestoreSession(): void {
        const hash = this.#locationHashService.read();
        const authResult = mapHashToAuthResult(hash);

        if (authResult === null) {
            this.#portalSessionFacade.validateSession();
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
                    this.#store.dispatch(AuthActions.createSession({ idToken: authResult.idToken }));
                }
                break;
            }
            case 'signup':
                this.#store.dispatch(AuthActions.signedUp());
                break;
        }
    }

    #handleLoginMissingIdToken(): void {
        // TODO: exception handling - also das hier ans backend senden.
        this.#store.dispatch(AuthActions.createSessionFailed());
    }

    #handleInvalidOAuthFlowHash(): void {
        // TODO: exception handling - also das hier ans backend senden.
        this.#store.dispatch(AuthActions.invalidOAuthFlowHash());
    }
}
