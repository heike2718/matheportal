import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinikaenguruEinstiegActions } from '../../core/ablaufsteuerung/minikaenguru-einstieg.actions';
import { DURCHFUEHRUNGSART } from '../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { Observable } from 'rxjs';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { selectWettbewerbskontextLoadState } from '../data/+state/privatperson.selectors';

@Injectable()
export class PrivatpersonFacade {
    readonly #store = inject(Store);

    readonly wettbewerbskontextLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE> = this.#store.select(
        selectWettbewerbskontextLoadState
    );

    public dashboardVorbereiten(): void {
        this.#store.dispatch(
            MinikaenguruEinstiegActions.kontextLadenOnWettbewerbsorganisationGestartet({
                durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                kontextkuerzel: undefined,
            })
        );
    }
}
