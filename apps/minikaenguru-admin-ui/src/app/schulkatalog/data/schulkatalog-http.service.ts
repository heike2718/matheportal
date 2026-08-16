import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ADMIN_CONFIGURATION } from '../../config/minikaenguru-admin.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Land, Ort, Schule } from '../model/schulkatalog.model';

@Injectable() // services in den remotes dürfen nicht in root provided werden, weil sonst das InjectionToken im root gesucht wird!!!
export class SchulkatalogHttpService {
    #config = inject(MINIKAENGURU_ADMIN_CONFIGURATION);
    #httpClient = inject(HttpClient);

    public loadLaender(): Observable<Land[]> {
        const options = { withCredentials: true };

        return this.#httpClient.get<Land[]>(this.#config.apiUrl + '/api/schulkatalog/laender', options);
    }

    public loadOrte(landId: string): Observable<Ort[]> {
        const options = { withCredentials: true };

        return this.#httpClient.get<Ort[]>(
            this.#config.apiUrl + '/api/schulkatalog/laender/' + landId + '/orte',
            options
        );
    }

    public loadSchulen(ortId: string): Observable<Schule[]> {
        const options = { withCredentials: true };

        return this.#httpClient.get<Schule[]>(
            this.#config.apiUrl + '/api/schulkatalog/orte/' + ortId + '/schulen',
            options
        );
    }
}
