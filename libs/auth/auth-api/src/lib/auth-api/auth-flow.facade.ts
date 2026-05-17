import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSessionFacade } from './auth-session.facade';
import { authActions } from '@matheportal/auth-data';

@Injectable({
    providedIn: 'root',
})
export class AuthFlowFacade {
    #store = inject(Store);
    #authSessionFacade = inject(AuthSessionFacade);

    login(): void {
        this.#store.dispatch(authActions.requestLoginUrl());
    }

    initClearOrRestoreSession(): void {
        this.#authSessionFacade.validateSession();
    }

    handleSessionExpired(): void {
        this.#store.dispatch(authActions.sessionValidationFailed({ reason: 'expired' }));
    }
}
