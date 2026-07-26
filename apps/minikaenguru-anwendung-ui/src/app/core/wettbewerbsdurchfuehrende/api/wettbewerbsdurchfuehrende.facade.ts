import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { wettbewerbsdurchfuehrendeActions } from '../data/+state/wettbewerbsdurchfuehrende.actions';
import { DURCHFUEHRUNGSART, WettbewerbsdurchfuerenderRequest } from '../model/wettbewerbsdurchfuehrende.model';
import { fromWettbewerbsdurchfuehrender } from '../data/+state/wettbewerbsdurchfuehrende.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class WettbewerbsdurchfuehrendeFacade {
    #store = inject(Store);

    readonly wettbewerbsdurchfuehrender = toSignal(
        this.#store.select(fromWettbewerbsdurchfuehrender.definedWettbewerbsdurchfuehrender)
    );

    /**
     * legt eine neue Privatperson als Wettbewerbsdurchführenden an.
     */
    public privatpersonAnlegen(): void {
        const requestDto: WettbewerbsdurchfuerenderRequest = {
            durchfuehrungsart: DURCHFUEHRUNGSART.privat,
            schule: null,
        };
        this.#store.dispatch(
            wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                requestDto,
            })
        );
    }

    public lehrpersonAnlegen(schule: string): void {
        console.log(
            'jetzt die action wettbewerbsdurchfuehrendenAnlegen mit Durchführungsart schule und der schule=' +
                schule +
                ' dispatchen'
        );
    }
}
