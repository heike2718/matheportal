import { inject, Injectable } from '@angular/core';
import {
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderRequest,
} from '../model/wettbewerbsdurchfuehrende.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';

@Injectable() // services in den remotes dürfen nicht in root provided werden, weil sonst das InjectionToken im root gesucht wird!!!
export class WettbewerbsdurchfuehrendeHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    /**
     * Legt einen neuen Wettbewerbsdurchführenden an.
     * @param requestDto WettbewerbsdurchfuehrenderRequest
     * @returns Observable eines Wettbewerbsdurchfuehrender
     */
    public createWettbewerbsdurchfuehrenden(
        requestDto: WettbewerbsdurchfuehrenderRequest
    ): Observable<Wettbewerbsdurchfuehrender> {
        return this.#httpClient.post<Wettbewerbsdurchfuehrender>(
            this.#config.apiUrl + '/api/wettbewerbsdurchfuehrende/konto',
            requestDto,
            { withCredentials: true }
        );
    }

    /**
     * Läd die Daten des Wettbewerbsdurchfuehrender.
     * @returns Observable eines Wettbewerbsdurchfuehrender
     */
    public loadWettbewerbsdurchfuehrenden(): Observable<Wettbewerbsdurchfuehrender> {
        return this.#httpClient.get<Wettbewerbsdurchfuehrender>(
            this.#config.apiUrl + '/api/wettbewerbsdurchfuehrende/konto',
            { withCredentials: true }
        );
    }
}
