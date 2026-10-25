import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinikaenguruEinstiegActions } from '../../core/ablaufsteuerung/minikaenguru-einstieg.actions';
import { DURCHFUEHRUNGSART } from '../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { Observable } from 'rxjs';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import {
    selectWettbewerbskontext,
    selectWettbewerbskontextLoaded,
    selectWettbewerbskontextLoadState,
} from '../data/+state/privatperson.selectors';
import { fromWettbewerb } from '../../core/wettbewerb/data/+state/wettbewerb.selectors';

@Injectable()
export class PrivatpersonFacade {
    readonly #store = inject(Store);

    readonly wettbewerbskontextLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE> = this.#store.select(
        selectWettbewerbskontextLoadState
    );

    readonly wettbewerbskontextLoaded = this.#store.selectSignal(selectWettbewerbskontextLoaded);

    readonly wettbewerbskontext = this.#store.selectSignal(selectWettbewerbskontext);

    readonly aktuellerWettbewerb = this.#store.selectSignal(fromWettbewerb.selectWettbewerb);

    public dashboardVorbereiten(): void {
        this.#store.dispatch(
            MinikaenguruEinstiegActions.kontextLadenOnWettbewerbsorganisationGestartet({
                durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                kontextkuerzel: undefined,
            })
        );
    }
}
