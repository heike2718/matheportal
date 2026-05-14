import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root',
})
export class AuthSessionFacade {
    #store = inject(Store);

    // hier kommt der state als Observables rein

    reloadSession(): void {
        //this.#store.dispatch(authActions.reloadSession());
    }
}
