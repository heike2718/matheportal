import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    selectSchulkollegiumLoaded,
    selectWettbewerbskontext,
    selectWettbewerbskontextLoaded,
    selectWettbewerbskontextLoadState,
} from '../data/+state/schule.selectors';
import { Observable } from 'rxjs';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { MinikaenguruEinstiegActions } from '../../core/ablaufsteuerung/minikaenguru-einstieg.actions';
import { DURCHFUEHRUNGSART } from '../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { isSchulauswahlMoeglich } from '../../lehrperson/api/public-lehrperson.selectors';
import { SchuleActions } from '../data/+state/schule.actions';

@Injectable()
export class SchuleFacade {
    readonly #store = inject(Store);

    readonly wettbewerbskontextLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE> = this.#store.select(
        selectWettbewerbskontextLoadState
    );

    readonly schulauswahlMoeglich = this.#store.selectSignal(isSchulauswahlMoeglich);

    readonly wettbewerbskontextLoaded = this.#store.selectSignal(selectWettbewerbskontextLoaded);

    readonly schulkollegiumLoaded = this.#store.selectSignal(selectSchulkollegiumLoaded);

    readonly wettbewerbskontext = this.#store.selectSignal(selectWettbewerbskontext);

    public dashboardVorbereiten(schulkuerzel: string): void {
        this.#store.dispatch(
            MinikaenguruEinstiegActions.kontextLadenOnWettbewerbsorganisationGestartet({
                durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                kontextkuerzel: schulkuerzel,
            })
        );
    }

    public schuleWechselnRequested(): void {
        this.#store.dispatch(SchuleActions.wettbewerbsorganisationVerlassen());
    }
}
