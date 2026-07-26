import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ort, Schule } from '../model/schulkatalog.model';

@Injectable() // services in den remotes dürfen nicht in root provided werden, weil sonst das InjectionToken im root gesucht wird!!!
export class SchulkatalogsucheHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    public findOrte(term: string): Observable<Ort[]> {
        const options = { params: new HttpParams().set('name', term.trim()), withCredentials: true };

        return this.#httpClient.get<Ort[]>(this.#config.apiUrl + '/api/schulkatalog/orte', options);
    }

    public loadSchulen(kuerzelOrt: string): Observable<Schule[]> {
        const url = this.#config.apiUrl + '/api/schulkatalog/orte/' + kuerzelOrt + '/schulen';

        return this.#httpClient.get<Schule[]>(url, { withCredentials: true });
    }
}
