import { computed, inject, Injectable } from '@angular/core';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { AuthorizationLoadState, MINIKAENGURU_BERECHTIGUNGSTYP } from '../authorization-model';
import { fromMkaAuthorization } from '../authorization-data';
import { Store } from '@ngrx/store';
import { mkaAuthorizationActions } from '../authorization-data/+state/mka-authorization.actions';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { portalRoutes } from '@matheportal/portal-navigation';

@Injectable() // kein providedIn: 'root', aber mittels mkaAuthorizationDataProvider in den remote.routes.ts im remote-Kontext providen
export class MkaAuthorizationFacade {
    readonly #portalSessionFacade = inject(AuthSessionFacade);
    readonly #store = inject(Store);

    readonly authorizationLoadState$: Observable<AuthorizationLoadState> = this.#store.select(
        fromMkaAuthorization.authorizationLoadState
    );

    readonly #berechtigungstyp = this.#store.selectSignal(fromMkaAuthorization.berechtigungstyp);

    readonly #authorizationLoadState = toSignal(this.authorizationLoadState$, { initialValue: 'not-loaded' });

    readonly isLehrperson = computed(() => this.#berechtigungstyp() === MINIKAENGURU_BERECHTIGUNGSTYP.schule);

    readonly isPrivatperson = computed(() => this.#berechtigungstyp() === MINIKAENGURU_BERECHTIGUNGSTYP.privat);

    readonly startViewState = computed(() => {
        const sessionState = this.#portalSessionFacade.sessionLoadingState();

        switch (sessionState) {
            case 'not-loaded':
                return 'loading';
            case 'unauthorized':
                return 'guest';
            case 'technical-error':
                return 'failed';
        }

        const authorizationState = this.#authorizationLoadState();

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
        this.#store.dispatch(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());
    }
}
