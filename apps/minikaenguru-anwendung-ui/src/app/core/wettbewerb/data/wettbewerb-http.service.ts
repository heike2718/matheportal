import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wettbewerb } from '../model/wettbewerb.model';

@Injectable()
export class WettbewerbHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    public loadWettbewerb(): Observable<Wettbewerb> {
        return this.#httpClient.get<Wettbewerb>(this.#config.apiUrl + '/api/wettbewerb', { withCredentials: true });
    }
}
