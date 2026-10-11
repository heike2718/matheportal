import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromSchulkatalogsuche } from '../data/+state/schulkatalogsuche.selectors';
import { SchulkatalogsucheActions } from '../data/+state/schulkatalogsuche.actions';
import { Ort, Schule } from '../../../core/model/schulkatalog.model';

@Injectable()
export class SchulkatalogsucheFacade {
    #store = inject(Store);

    readonly orte = this.#store.selectSignal(fromSchulkatalogsuche.selectOrte);

    readonly schulen = this.#store.selectSignal(fromSchulkatalogsuche.selectSchulen);

    readonly selectedOrt = this.#store.selectSignal(fromSchulkatalogsuche.selectSelectedOrt);

    readonly nameSelectedOrt = this.#store.selectSignal(fromSchulkatalogsuche.selectNameSelectedOrt);

    readonly selectedSchule = this.#store.selectSignal(fromSchulkatalogsuche.selectSelectedSchule);

    readonly isOrteLoaded = this.#store.selectSignal(fromSchulkatalogsuche.orteLoaded);

    readonly isOrtSelected = this.#store.selectSignal(fromSchulkatalogsuche.ortSelected);

    readonly isSchulenLoaded = this.#store.selectSignal(fromSchulkatalogsuche.schulenLoaded);

    readonly isSchuleSelected = this.#store.selectSignal(fromSchulkatalogsuche.schuleSelected);

    readonly schuleEintragenMoeglich = this.#store.selectSignal(fromSchulkatalogsuche.selectSchuleEintragenMoeglich);

    public findOrte(name: string): void {
        this.#store.dispatch(SchulkatalogsucheActions.findOrte({ name }));
    }

    public ortSelected(ort: Ort): void {
        this.#store.dispatch(SchulkatalogsucheActions.ortSelected({ ort }));
    }

    public schuleSelected(schule: Schule): void {
        this.#store.dispatch(SchulkatalogsucheActions.schuleSelected({ schule }));
    }

    public ortssucheRequested(): void {
        this.#store.dispatch(SchulkatalogsucheActions.resetSuche());
    }

    public schuleNichtGefunden(): void {
        this.#store.dispatch(SchulkatalogsucheActions.submitSchulkatalogantragRequested());
    }
}
