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

    readonly user$: Observable<User> = this.#store.select(fromAuth.user);

    readonly #sessionLoadingState$: Observable<RESOURCE_LOAD_STATE> = this.#store.select(fromAuth.sessionLoadingState);

    readonly #isAdmin$: Observable<boolean> = this.#store.select(fromAuth.isAdmin);

    readonly user = toSignal(this.user$, { initialValue: anonymousUser });
    readonly sessionLoadingState = toSignal(this.#sessionLoadingState$, { initialValue: 'not-loaded' });
    readonly isLoggedIn = computed(() => this.sessionLoadingState() === 'loaded');
    readonly isAdmin = toSignal(this.#isAdmin$, { initialValue: false });

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
