import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { schulkatalogActions } from '../data/+state/schulkatalog.actions';
import { Land, Ort, Schule } from '../model/schulkatalog.model';
import { fromSchulkatalog } from '../data/+state/schulkatalog.selectors';

@Injectable() // nicht in root providen, da remote
export class SchulkatalogFacade {
    #store = inject(Store);

    readonly laender = this.#store.selectSignal(fromSchulkatalog.selectLaender);
    readonly orte = this.#store.selectSignal(fromSchulkatalog.selectOrte);
    readonly schulen = this.#store.selectSignal(fromSchulkatalog.selectSchulen);

    readonly isLaenderLoaded = this.#store.selectSignal(fromSchulkatalog.selectLaenderLoadad);
    readonly isOrteLoaded = this.#store.selectSignal(fromSchulkatalog.selectOrteLoaded);
    readonly isSchulenLoaded = this.#store.selectSignal(fromSchulkatalog.selectSchulenLoaded);

    readonly isLandSelected = this.#store.selectSignal(fromSchulkatalog.selectLandSelected);
    readonly isOrtSelected = this.#store.selectSignal(fromSchulkatalog.selectOrtSelected);
    readonly isSchuleSelected = this.#store.selectSignal(fromSchulkatalog.selectSchuleSelected);

    readonly selectedLand = this.#store.selectSignal(fromSchulkatalog.selectSelectedLand);
    readonly selectedOrt = this.#store.selectSignal(fromSchulkatalog.selectSelectedOrt);
    readonly selectedSchule = this.#store.selectSignal(fromSchulkatalog.selectSelectedSchule);

    readonly nameSelectedLand = this.#store.selectSignal(fromSchulkatalog.selectNameSelectedLand);
    readonly beschreibungSelectedOrt = this.#store.selectSignal(fromSchulkatalog.selectBeschreibungSelectedOrt);

    public loadLaender(): void {
        this.#store.dispatch(schulkatalogActions.loadLaender());
    }

    public landSelected(land: Land): void {
        this.#store.dispatch(schulkatalogActions.landSelected({ land }));
    }

    public ortSelected(ort: Ort): void {
        this.#store.dispatch(schulkatalogActions.ortSelected({ ort }));
    }

    public schuleSelected(schule: Schule): void {
        this.#store.dispatch(schulkatalogActions.schuleSelected({ schule }));
    }
}
