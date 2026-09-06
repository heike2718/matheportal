import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ort, Schule } from '../model/schulkatalog.model';
import { paths } from '../../../generated/api-types';

@Injectable() // services in den remotes dürfen nicht in root provided werden, weil sonst das InjectionToken im root gesucht wird!!!
export class SchulkatalogsucheHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    public findOrte(term: string): Observable<Ort[]> {
        const options = { params: new HttpParams().set('name', term.trim()), withCredentials: true };
        const path: keyof paths = '/api/schulkatalog/orte';

        return this.#httpClient.get<Ort[]>(this.#config.apiUrl + path, options);
    }

    public loadSchulen(kuerzelOrt: string): Observable<Schule[]> {
        const path = `/api/schulkatalog/orte/${kuerzelOrt}/schulen` as const;
        return this.#httpClient.get<Schule[]>(this.#config.apiUrl + path, { withCredentials: true });
    }
}
