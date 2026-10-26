import { inject, Injectable } from '@angular/core';
import { PUBLIC_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { fromWettbewerb } from '../data/+state/wettbewerb.selectors';
import { WettbewerbActions } from '../data/+state/wettbewerb.actions';

@Injectable()
export class WettbewerbFacade {
    readonly #store = inject(Store);

    readonly wettbewerbLoadState$: Observable<PUBLIC_RESOURCE_LOAD_STATE> = this.#store.select(
        fromWettbewerb.selectWettbewerbLoadState
    );

    readonly aktuellerWettbewerb = this.#store.selectSignal(fromWettbewerb.selectWettbewerb);

    readonly wettbewerbLoaded = this.#store.selectSignal(fromWettbewerb.selectWettbewerbLoaded);

    public ensureWettbewerbGeladen(): void {
        this.#store.dispatch(WettbewerbActions.ensureWettbewerbGeladen());
    }
}
