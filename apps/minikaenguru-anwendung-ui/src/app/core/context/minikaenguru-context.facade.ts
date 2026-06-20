import { computed, inject, Injectable } from '@angular/core';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { resolveVeranstaltertyp } from './minikaenguru-context.utils';
import { VERANSTALTERTYP } from './minikaenguru-context.model';

@Injectable({
    providedIn: 'root',
})
export class MinikaenguruContextFacade {
    readonly #authSessionFacade = inject(AuthSessionFacade);

    readonly #user = toSignal(this.#authSessionFacade.user$, {
        initialValue: null,
    });

    readonly #veranstaltertyp = computed(() => resolveVeranstaltertyp(this.#user()));

    readonly isLoggedIn = computed(() => !this.#user()?.anonym);
    readonly isStandarduser = computed(() => this.#veranstaltertyp() === VERANSTALTERTYP.none);
    readonly isLehrer = computed(() => this.#veranstaltertyp() === VERANSTALTERTYP.lehrer);
    readonly isPrivatveranstalter = computed(() => this.#veranstaltertyp() === VERANSTALTERTYP.privat);
}
