import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { wettbewerbsdurchfuehrendeActions } from '../data/+state/wettbewerbsdurchfuehrende.actions';
import { fromWettbewerbsdurchfuehrender } from '../data/+state/wettbewerbsdurchfuehrende.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class WettbewerbsdurchfuehrendeFacade {
    #store = inject(Store);

    readonly wettbewerbsdurchfuehrender = toSignal(
        this.#store.select(fromWettbewerbsdurchfuehrender.wettbewerbsdurchfuehrender)
    );

    public durchfuehrungsartPrivatGewaehlt(): void {
        this.#store.dispatch(wettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt());
    }

    public durchfuehrungsartSchuleGewaehlt(): void {
        this.#store.dispatch(wettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt());
    }
}
