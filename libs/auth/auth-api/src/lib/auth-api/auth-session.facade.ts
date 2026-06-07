import { inject, Injectable } from '@angular/core';
import { authActions, fromAuth } from '@matheportal/auth-data';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '@matheportal/auth-model';

@Injectable({
    providedIn: 'root',
})
export class AuthSessionFacade {
    #store = inject(Store);

    user$: Observable<User> = this.#store.select(fromAuth.user);

    isSessionValidated$: Observable<boolean> = this.#store.select(fromAuth.isSessionValidated);

    /**
     * validiert die bestehende Session.
     */
    validateSession(): void {
        this.#store.dispatch(authActions.validateSession());
    }
}
