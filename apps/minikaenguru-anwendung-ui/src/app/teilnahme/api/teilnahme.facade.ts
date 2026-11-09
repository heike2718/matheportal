import { inject, Injectable } from '@angular/core';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TeilnahmeActions } from '../data/+state/teilnahme.actions';
import { selectTeilnahmeLoadState } from '../data/+state/teilnahme.selectors';

@Injectable()
export class TeilnahmeFacade {
    readonly #store = inject(Store);

    readonly teilnahmeLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE> =
        this.#store.select(selectTeilnahmeLoadState);

    public aktuellePrivatteilnahmeVorbereiten(): void {
        this.#store.dispatch(TeilnahmeActions.ensurePrivatteilnahmeLoaded());
    }
}
