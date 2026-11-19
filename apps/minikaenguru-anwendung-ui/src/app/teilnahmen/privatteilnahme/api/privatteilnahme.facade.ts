import { inject, Injectable } from '@angular/core';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    selectAktuelleTeilnahmeLoaded,
    selectAngemeldet,
    selectTeilnahme,
    selectTeilnahmeLoadState,
} from '../data/+state/privatteilnahme.selectors';
import { PrivatteilnahmeActions } from '../data/+state/privatteilnahme.actions';

@Injectable()
export class PrivatteilnahmeFacade {
    readonly #store = inject(Store);

    readonly teilnahmeLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE> =
        this.#store.select(selectTeilnahmeLoadState);

    readonly aktuelleTeilnahmeLoaded = this.#store.selectSignal(selectAktuelleTeilnahmeLoaded);

    readonly angemeldet = this.#store.selectSignal(selectAngemeldet);

    readonly aktuelleTeilnahme = this.#store.selectSignal(selectTeilnahme);

    public aktuellePrivatteilnahmeVorbereiten(): void {
        this.#store.dispatch(PrivatteilnahmeActions.ensurePrivatteilnahmeGeladen());
    }

    public privatteilnahmeAnmelden(): void {
        this.#store.dispatch(PrivatteilnahmeActions.privatteilnahmeAnmelden());
    }
}
