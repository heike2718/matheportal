import { computed, inject, Injectable } from '@angular/core';
import { AuthorizationLoadState, MINIKAENGURU_BERECHTIGUNGSTYP } from '../authorization-model';
import { fromMkaAuthorization } from '../authorization-data';
import { Store } from '@ngrx/store';
import { MkaAuthorizationActions } from '../authorization-data/+state/mka-authorization.actions';
import { Observable } from 'rxjs';
import { MinikaenguruEinstiegActions } from '../../ablaufsteuerung/minikaenguru-einstieg.actions';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable() // kein providedIn: 'root', aber mittels mkaAuthorizationDataProvider in den remote.routes.ts im remote-Kontext providen
export class MkaAuthorizationFacade {
    readonly #store = inject(Store);

    readonly authorizationLoadState$: Observable<AuthorizationLoadState> = this.#store.select(
        fromMkaAuthorization.authorizationLoadState
    );

    readonly berechtigungstyp$: Observable<MINIKAENGURU_BERECHTIGUNGSTYP> = this.#store.select(
        fromMkaAuthorization.berechtigungstyp
    );

    readonly #berechtigungstyp = toSignal(this.berechtigungstyp$);

    readonly isLehrperson = computed(() => this.#berechtigungstyp() === MINIKAENGURU_BERECHTIGUNGSTYP.schule);

    readonly isPrivatperson = computed(() => this.#berechtigungstyp() === MINIKAENGURU_BERECHTIGUNGSTYP.privat);

    minikaenguruAufgerufen(): void {
        this.#store.dispatch(MinikaenguruEinstiegActions.rootEinstiegRequested());
    }

    ensureAuthorizationLoaded(): void {
        this.#store.dispatch(MkaAuthorizationActions.ensureMkaAuthorizationLoaded());
    }
}
