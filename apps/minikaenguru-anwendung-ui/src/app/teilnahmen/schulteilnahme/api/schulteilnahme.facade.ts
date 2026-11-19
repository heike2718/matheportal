import { inject, Injectable } from '@angular/core';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    selectAktuelleTeilnahmeLoaded,
    selectAngemeldet,
    selectAnmeldendePersonGeladen,
    selectKlassen,
    selectTeilnahme,
    selectTeilnahmeLoadState,
} from '../data/+state/schulteilnahme.selectors';
import { SchulteilnahmeActions } from '../data/+state/schulteilnahme.actions';

@Injectable()
export class SchulteilnahmeFacade {
    readonly #store = inject(Store);

    readonly teilnahmeLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE> =
        this.#store.select(selectTeilnahmeLoadState);

    readonly aktuelleTeilnahmeLoaded = this.#store.selectSignal(selectAktuelleTeilnahmeLoaded);

    readonly angemeldet = this.#store.selectSignal(selectAngemeldet);

    readonly aktuelleTeilnahme = this.#store.selectSignal(selectTeilnahme);

    readonly anmeldendePersonGeladen = this.#store.selectSignal(selectAnmeldendePersonGeladen);

    readonly klassen = this.#store.selectSignal(selectKlassen);

    public aktuelleSchulteilnahmeVorbereiten(schulkuerzel: string): void {
        this.#store.dispatch(SchulteilnahmeActions.ensureSchulteilnahmeGeladen({ schulkuerzel }));
    }
}
