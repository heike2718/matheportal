import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromSchulkatalogsuche } from '../data/+state/schulkatalogsuche.selectors';
import { schulkatalogsucheActions } from '../data/+state/schulkatalogsuche.actions';
import { Ort, Schule } from '../model/schulkatalog.model';

@Injectable()
export class SchulkatalogsucheFacade {
    #store = inject(Store);

    readonly orte = this.#store.selectSignal(fromSchulkatalogsuche.selectOrte);

    readonly schulen = this.#store.selectSignal(fromSchulkatalogsuche.selectSchulen);

    readonly selectedOrt = this.#store.selectSignal(fromSchulkatalogsuche.selectSelectedOrt);

    readonly selectedSchule = this.#store.selectSignal(fromSchulkatalogsuche.selectSelectedSchule);

    readonly isOrteLoaded = this.#store.selectSignal(fromSchulkatalogsuche.orteLoaded);

    readonly isOrtSelected = this.#store.selectSignal(fromSchulkatalogsuche.ortSelected);

    readonly isSchulenLoaded = this.#store.selectSignal(fromSchulkatalogsuche.schulenLoaded);

    readonly isSchuleSelected = this.#store.selectSignal(fromSchulkatalogsuche.schuleSelected);

    public findOrte(name: string): void {
        this.#store.dispatch(schulkatalogsucheActions.findOrte({ name }));
    }

    public ortSelected(ort: Ort): void {
        this.#store.dispatch(schulkatalogsucheActions.ortSelected({ ort }));
    }

    public loadSchulen(ort: Ort): void {
        this.#store.dispatch(schulkatalogsucheActions.loadSchulen({ ort }));
    }

    public schuleSelected(schule: Schule): void {
        this.#store.dispatch(schulkatalogsucheActions.schuleSelected({ schule }));
    }
}
