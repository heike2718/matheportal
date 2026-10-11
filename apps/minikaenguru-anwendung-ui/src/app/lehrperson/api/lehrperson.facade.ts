import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Schule } from '../../core/model/schulkatalog.model';
import { LehrpersonActions } from '../data/+state/lehrperson.actions';
import { selectSchulen, selectSchulenLoaded } from '../data/+state/lehrperson.selectors';

@Injectable()
export class LehrpersonFacade {
    readonly #store = inject(Store);

    readonly isSchulenLoaded = this.#store.selectSignal(selectSchulenLoaded);
    readonly schulen = this.#store.selectSignal(selectSchulen);

    public schuleAusgewaehlt(schule: Schule): void {
        this.#store.dispatch(LehrpersonActions.wettbewerbsorganisationGestartet({ schulkuerzel: schule.kuerzel }));
    }
}
