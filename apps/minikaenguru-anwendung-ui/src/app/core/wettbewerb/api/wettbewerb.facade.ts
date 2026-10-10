import { inject, Injectable } from '@angular/core';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { fromWettbewerb } from '../data/+state/wettbewerb.selectors';
import { WettbewerbActions } from '../data/+state/wettbewerb.actions';

@Injectable()
export class WettbewerbFacade {
    readonly #store = inject(Store);

    readonly wettbewerbLoadState$: Observable<RESOURCE_LOAD_STATE> = this.#store.select(
        fromWettbewerb.selectWettbewerbLoadState
    );

    public ensureWettbewergGeladen(): void {
        this.#store.dispatch(WettbewerbActions.ensureWettbewerbGeladen());
    }
}
