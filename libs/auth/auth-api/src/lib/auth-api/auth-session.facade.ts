import { inject, Injectable } from '@angular/core';
import { authActions, fromAuth } from '@matheportal/auth-data';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { anonymousUser, User } from '@matheportal/auth-model';

@Injectable({
    providedIn: 'root',
})
export class AuthSessionFacade {
    #store = inject(Store);

    user$: Observable<User> = this.#store.select(fromAuth.user);
    #hasSession$: Observable<boolean> = this.#store.select(fromAuth.hasSession);

    readonly user = toSignal(this.user$, { initialValue: anonymousUser });
    readonly isLoggedIn = toSignal(this.#hasSession$, { initialValue: false });

    /**
     * validiert die bestehende Session.
     */
    validateSession(): void {
        this.#store.dispatch(authActions.validateSession());
    }

    /**
     * Nachdem der user um weitere Berechtigungen angereichert wurde, kann der Store synchronisiert werden.
     * @param user User
     */
    synchronizeUser(user: User): void {
        this.#store.dispatch(authActions.userAugmented({ user }));
    }
}
