import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    selectKollegen,
    selectSchulauswahlMoeglich,
    selectSchulkollegiumLoaded,
    selectTeilnahmen,
    selectWettbewerbskontext,
    selectWettbewerbskontextLoaded,
} from '../data/+state/schulen.selectors';
import { fromWettbewerb } from '../../core/wettbewerb/data/+state/wettbewerb.selectors';
import { Observable, of } from 'rxjs';
import { UrlTree } from '@angular/router';

@Injectable()
export class SchuleFacade {
    readonly #store = inject(Store);

    readonly schulauswahlMoeglich = this.#store.selectSignal(selectSchulauswahlMoeglich);

    readonly wettbewerbskontextLoaded = this.#store.selectSignal(selectWettbewerbskontextLoaded);

    readonly schulkollegiumLoaded = this.#store.selectSignal(selectSchulkollegiumLoaded);

    readonly wettbewerbskontext = this.#store.selectSignal(selectWettbewerbskontext);

    readonly aktuellerWettbewerb = this.#store.selectSignal(fromWettbewerb.selectWettbewerb);

    public dashboardVorbereiten(schulkuerzel: string): Observable<boolean | UrlTree> {
        console.log('dashboard für schule vorbereiten: ' + schulkuerzel);
        return of(true);
    }
}
