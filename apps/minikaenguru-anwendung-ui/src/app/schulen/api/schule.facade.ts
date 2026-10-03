import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    selectSchulauswahlMoeglich,
    selectSchulkollegiumLoaded,
    selectWettbewerbskontext,
    selectWettbewerbskontextLoaded,
    selectWettbewerbskontextLoadingState,
} from '../data/+state/schulen.selectors';
import { fromWettbewerb } from '../../core/wettbewerb/data/+state/wettbewerb.selectors';
import { prepareWettbewerbsorganisation } from '../../lehrperson/api/lehrperson-store.events';
import { Observable } from 'rxjs';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

@Injectable()
export class SchuleFacade {
    readonly #store = inject(Store);

    readonly wettbewerbskontextLoadingState$: Observable<RESOURCE_LOAD_STATE> = this.#store.select(
        selectWettbewerbskontextLoadingState
    );

    readonly schulauswahlMoeglich = this.#store.selectSignal(selectSchulauswahlMoeglich);

    readonly wettbewerbskontextLoaded = this.#store.selectSignal(selectWettbewerbskontextLoaded);

    readonly schulkollegiumLoaded = this.#store.selectSignal(selectSchulkollegiumLoaded);

    readonly wettbewerbskontext = this.#store.selectSignal(selectWettbewerbskontext);

    readonly aktuellerWettbewerb = this.#store.selectSignal(fromWettbewerb.selectWettbewerb);

    public dashboardVorbereiten(schulkuerzel: string): void {
        this.#store.dispatch(prepareWettbewerbsorganisation({ schulkuerzel }));
    }
}
