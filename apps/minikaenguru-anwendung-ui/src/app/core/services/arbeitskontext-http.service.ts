import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../config/minikaenguru-anwendung.configuration';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schule } from '../model/schulkatalog.model';
import { SchuleWettbewerbskontext, Schulkollegium } from '../model/schule-wettbewerbskontext.model';
import { SILENT_LOAD_CONTEXT } from '@matheportal/feedback-contracts';

@Injectable()
export class ArbeitskontextHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    /**
     * Läd die Schulen der Lehrperson.
     * @returns Observable Schulen[]
     */
    public loadLehrpersonSchulen(): Observable<Schule[]> {
        return this.#httpClient.get<Schule[]>(this.#config.apiUrl + '/api/wettbewerbsdurchfuehrende/me/schulen', {
            withCredentials: true,
        });
    }

    /**
     *
     * @param schuleId Läd den Wettbewerbskontext der Schule mit dieser id.
     * @returns Observable
     */
    public loadSchuleWettbewerbskontext(schuleId: string): Observable<SchuleWettbewerbskontext> {
        return this.#httpClient.get<SchuleWettbewerbskontext>(this.#config.apiUrl + '/api/schulen/' + schuleId, {
            withCredentials: true,
        });
    }

    /**
     *
     * @param schuleId Läd das Schulkolegium
     * @returns
     */
    public loadSchulkollegium(schuleId: string): Observable<Schulkollegium> {
        return this.#httpClient.get<Schulkollegium>(this.#config.apiUrl + '/api/schulen/' + schuleId + '/kollegen', {
            context: new HttpContext().set(SILENT_LOAD_CONTEXT, true),
            withCredentials: true,
        });
    }
}
