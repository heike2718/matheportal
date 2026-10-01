import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    selectAnmeldungMoeglich,
    selectKollegen,
    selectSchulauswahlMoeglich,
    selectSchule,
    selectSchulkollegiumLoaded,
    selectTeilnahmen,
    selectVertragDSGVOVorhanden,
    selectWettbewerbskontextLoaded,
} from '../data/+state/schulen.selectors';
import { fromWettbewerb } from '../../core/wettbewerb/data/+state/wettbewerb.selectors';
import { Observable, of } from 'rxjs';
import { UrlTree } from '@angular/router';

@Injectable()
export class SchuleFacade {
    readonly #store = inject(Store);

    readonly schule = this.#store.select(selectSchule);

    readonly schulauswahlMoeglich = this.#store.selectSignal(selectSchulauswahlMoeglich);

    readonly wettbewerbskontextLoaded = this.#store.selectSignal(selectWettbewerbskontextLoaded);

    readonly schulkollegiumLoaded = this.#store.selectSignal(selectSchulkollegiumLoaded);

    readonly anmeldungMoeglich = this.#store.selectSignal(selectAnmeldungMoeglich);

    readonly vertragDSGVOVorhanden = this.#store.selectSignal(selectVertragDSGVOVorhanden);

    readonly teilnahmen = this.#store.selectSignal(selectTeilnahmen);

    readonly kollegen = this.#store.selectSignal(selectKollegen);

    readonly aktuellerWettbewerb = this.#store.selectSignal(fromWettbewerb.selectWettbewerb);

    public dashboardVorbereiten(schulkuerzel: string): Observable<boolean | UrlTree> {
        return of(true);
    }
}
