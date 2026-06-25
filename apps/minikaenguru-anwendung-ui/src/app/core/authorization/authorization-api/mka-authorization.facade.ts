import { computed, inject, Injectable } from '@angular/core';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthorizationLoadState, Veranstaltertyp, VERANSTALTERTYP } from '../authorization-model';
import { fromMkaAuthorization } from '../authorization-data';
import { AuthFlowObserver } from '@matheportal/shared-model';
import { Store } from '@ngrx/store';
import { mkaAuthorizationActions } from '../authorization-data/+state/mka-authorization.actions';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MkaAuthorizationFacade implements AuthFlowObserver {
    readonly #authSessionFacade = inject(AuthSessionFacade);
    readonly #store = inject(Store);

    readonly #authorizationLoadState$: Observable<AuthorizationLoadState> = this.#store.select(
        fromMkaAuthorization.authorizationLoadState
    );

    readonly #veranstalterTyp$: Observable<Veranstaltertyp> = this.#store.select(fromMkaAuthorization.veranstalterTyp);

    readonly #user = toSignal(this.#authSessionFacade.user$, {
        initialValue: null,
    });

    readonly #authorizationLoadState = toSignal(this.#authorizationLoadState$, { initialValue: 'not-loaded' });
    readonly #veranstaltertyp = toSignal(this.#veranstalterTyp$, { initialValue: 'NONE' });
    readonly #isLoggedIn = computed(() => !this.#user()?.anonym);

    readonly isLehrer = computed(() => this.#veranstaltertyp() === VERANSTALTERTYP.lehrer);

    readonly isPrivatveranstalter = computed(() => this.#veranstaltertyp() === VERANSTALTERTYP.privat);

    readonly startViewState = computed(() => {
        const authorizationState = this.#authorizationLoadState();

        if (!this.#isLoggedIn()) {
            return 'guest';
        }

        if (authorizationState === 'not-loaded') {
            return 'loading';
        }

        if (authorizationState === 'failed') {
            return 'failed';
        }

        if (this.isPrivatveranstalter()) {
            return 'dashboard-privat';
        }

        if (this.isLehrer()) {
            return 'dashboard-lehrer';
        }

        return 'veranstalter-anlegen';
    });

    ensureAuthorizationLoaded(): void {
        if (this.#isLoggedIn()) {
            this.#store.dispatch(mkaAuthorizationActions.loadMkaAuthorization());
        }
    }

    getId(): string {
        return 'MkaAuthorizationFacade';
    }

    userLoggedOut(): void {
        this.#store.dispatch(mkaAuthorizationActions.userLoggedOut());
    }
}
