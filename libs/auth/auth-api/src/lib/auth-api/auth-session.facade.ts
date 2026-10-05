import { computed, inject, Injectable } from '@angular/core';
import { authActions, fromAuth } from '@matheportal/auth-data';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { anonymousUser, User } from '@matheportal/auth-model';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

@Injectable({
    providedIn: 'root',
})
export class AuthSessionFacade {
    #store = inject(Store);

    readonly sessionLoadState$: Observable<RESOURCE_LOAD_STATE> = this.#store.select(fromAuth.sessionLoadState);
    readonly user$: Observable<User> = this.#store.select(fromAuth.user);

    readonly sessionLoadState = toSignal(this.sessionLoadState$, { initialValue: 'not-loaded' });

    readonly user = toSignal(this.user$, { initialValue: anonymousUser });
    readonly isLoggedIn = computed(() => this.sessionLoadState() === 'loaded');
    readonly isAdmin = this.#store.selectSignal(fromAuth.isAdmin);

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
