import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSessionFacade } from './auth-session.facade';

@Injectable({
    providedIn: 'root',
})
export class AuthFlowFacade {
    #store = inject(Store);
    #authSessionFacade = inject(AuthSessionFacade);

    login(): void {
        // hier die requestLoginUrl-Action triggern
    }

    initClearOrRestoreSession(): void {
        // hier dann ggf
        this.#authSessionFacade.reloadSession();
    }
}
