import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RaetselbaukastenEinstiegActions } from './raetselbaukasten-einstieg.actions';

@Injectable()
export class RaetselbaukastenEinstiegFacade {
    readonly #store = inject(Store);

    public raetselbaukastenAufgerufen(): void {
        this.#store.dispatch(RaetselbaukastenEinstiegActions.rootEinstiegRequested());
    }
}
