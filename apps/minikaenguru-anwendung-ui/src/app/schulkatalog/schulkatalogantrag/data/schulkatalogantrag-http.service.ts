import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { HttpClient } from '@angular/common/http';
import { Schulkatalogantrag } from '../model/schulkatalogantrag.model';
import { Observable } from 'rxjs';

@Injectable()
export class SchulkatalogantragHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    public submitSchulkatalogantrag(payload: Schulkatalogantrag): Observable<void> {
        const options = { withCredentials: true };
        const path = '/api/schulkatalogantrag';

        return this.#httpClient.post<void>(this.#config.apiUrl + path, payload, options);
    }
}
