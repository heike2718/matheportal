import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSessionFacade } from './auth-session.facade';
import { authActions } from '@matheportal/auth-data';
import { LOCATION_HASH_SERVICE, mapHashToAuthResult } from '@matheportal/auth-model';
import { AuthFlowObserver } from '@matheportal/shared-model';

@Injectable({
    providedIn: 'root',
})
export class AuthFlowFacade {
    #store = inject(Store);
    #authSessionFacade = inject(AuthSessionFacade);
    #locationHashService = inject(LOCATION_HASH_SERVICE);

    #authFlowObservers: AuthFlowObserver[] = [];

    login(): void {
        this.#store.dispatch(authActions.requestLoginUrl());
    }

    logout(): void {
        this.#store.dispatch(authActions.logOut());
        this.notifyObservers();
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
                // hier ist erstmal noch nicht klar, was passieren soll.
                break;
        }
    }

    registerObserver(observer: AuthFlowObserver): void {
        const registeredObservers = this.#authFlowObservers.filter(o => o.getId() === observer.getId());
        if (registeredObservers.length === 0) {
            this.#authFlowObservers.push(observer);
        }
    }

    notifyObservers(): void {
        for (const observer of this.#authFlowObservers) {
            observer.userLoggedOut();
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
