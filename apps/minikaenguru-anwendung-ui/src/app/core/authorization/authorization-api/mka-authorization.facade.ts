import { computed, inject, Injectable } from '@angular/core';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    AuthorizationLoadState,
    MinikaenguruBerechtigungstyp,
    MINIKAENGURU_BERECHTIGUNGSTYP,
} from '../authorization-model';
import { fromMkaAuthorization } from '../authorization-data';
import { Store } from '@ngrx/store';
import { mkaAuthorizationActions } from '../authorization-data/+state/mka-authorization.actions';
import { Observable } from 'rxjs';

@Injectable() // kein providedIn: 'root', aber mittels mkaAuthorizationDataProvider in den remote.routes.ts im remote-Kontext providen
export class MkaAuthorizationFacade {
    readonly #authSessionFacade = inject(AuthSessionFacade);
    readonly #store = inject(Store);

    readonly authorizationLoadState$: Observable<AuthorizationLoadState> = this.#store.select(
        fromMkaAuthorization.authorizationLoadState
    );

    readonly #berechtigungstyp$: Observable<MinikaenguruBerechtigungstyp> = this.#store.select(
        fromMkaAuthorization.berechtigungstyp
    );
    readonly #authorizationLoadState = toSignal(this.authorizationLoadState$, { initialValue: 'not-loaded' });
    readonly #berechtigungstyp = toSignal(this.#berechtigungstyp$, {
        initialValue: MINIKAENGURU_BERECHTIGUNGSTYP.none,
    });

    readonly isLehrperson = computed(() => this.#berechtigungstyp() === MINIKAENGURU_BERECHTIGUNGSTYP.schule);

    readonly isPrivatperson = computed(() => this.#berechtigungstyp() === MINIKAENGURU_BERECHTIGUNGSTYP.privat);

    readonly startViewState = computed(() => {
        const authorizationState = this.#authorizationLoadState();

        if (!this.#authSessionFacade.isLoggedIn()) {
            return 'guest';
        }

        if (authorizationState === 'not-loaded') {
            return 'loading';
        }

        if (authorizationState === 'failed') {
            return 'failed';
        }

        if (this.isPrivatperson()) {
            return 'dashboard-privatperson';
        }

        if (this.isLehrperson()) {
            return 'dashboard-lehrperson';
        }

        return 'needs-wettbewerbsdurchfuehrenden';
    });

    ensureAuthorizationLoaded(): void {
        if (this.#authSessionFacade.isLoggedIn()) {
            this.#store.dispatch(mkaAuthorizationActions.loadMkaAuthorization());
        }
    }
}
