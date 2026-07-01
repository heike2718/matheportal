import { Injectable } from '@angular/core';
import {
    WettbewerbsdurchfuehrenderDto,
    WettbewerbsdurchfuerenderRequest,
} from '../model/wettbewerbsdurchfuehrende.model';
import { Observable, of } from 'rxjs';

@Injectable() // services in den remotes dürfen nicht in root provided werden, weil sonst das InjectionToken im root gesucht wird!!!
export class WettbewerbsdurchfuehrendeHttpSerice {
    /**
     * Legt einen neuen Wettbewerbsdurchführenden an.
     * @param requestDto WettbewerbsdurchfuerenderRequest
     * @returns WettbewerbsdurchfuehrenderDto
     */
    public createWettbewerbsdurchfuehrenden(
        requestDto: WettbewerbsdurchfuerenderRequest
    ): Observable<WettbewerbsdurchfuehrenderDto> {
        const result: WettbewerbsdurchfuehrenderDto = {
            durchfuehrungsart: 'PRIVAT',
            newsletter: false,
            teilnahmenummern: ['T432523627'],
            zugangsberechtigungUnterlagen: 'STANDARD',
        };

        return of(result);
    }
}
