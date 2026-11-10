import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../config/minikaenguru-anwendung.configuration';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schule } from '../model/schulkatalog.model';
import { ERROR_MESSAGE_HANDLED_LOCALLY, SILENT_LOAD_CONTEXT } from '@matheportal/feedback-contracts';
import { PrivatpersonWettbewerbskontext } from '../../privatperson/model/privatperson.model';
import { paths } from '../../generated/api-types';
import { SchuleWettbewerbskontext, Schulkollegium } from '../../schule/model/schule.model';

@Injectable()
export class ArbeitskontextHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    /**
     * Läd die Schulen der Lehrperson.
     * @returns Observable<Schule[]>
     */
    public loadLehrpersonSchulen(): Observable<Schule[]> {
        const path: keyof paths = '/api/lehrperson/me/schulen';
        return this.#httpClient.get<Schule[]>(this.#config.apiUrl + path, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }

    /**
     *
     * @param schuleId Läd den Wettbewerbskontext der Schule mit dieser id.
     * @returns Observable<SchuleWettbewerbskontext>
     */
    public loadSchuleWettbewerbskontext(schuleId: string): Observable<SchuleWettbewerbskontext> {
        const pathTemplate: keyof paths = '/api/schulen/{schuleId}/wettbewerbskontext';
        const path = pathTemplate.replace('{schuleId}', schuleId);

        return this.#httpClient.get<SchuleWettbewerbskontext>(this.#config.apiUrl + path, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }

    /**
     *
     * @param schuleId Läd das Schulkollegium.
     * @returns Observable<Schulkollegium>
     */
    public loadSchulkollegium(schuleId: string): Observable<Schulkollegium> {
        const pathTemplate: keyof paths = '/api/schulen/{schuleId}/kollegium';
        const path = pathTemplate.replace('{schuleId}', schuleId);

        return this.#httpClient.get<Schulkollegium>(this.#config.apiUrl + path, {
            context: new HttpContext().set(SILENT_LOAD_CONTEXT, true).set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }

    /**
     * Läd den Wettbewerbskontext der eingollgten Privatperson.
     * @returns Observable<PrivatpersonWettbewerbskontext>
     */
    public loadPrivatpersonWettbewerbskontext(): Observable<PrivatpersonWettbewerbskontext> {
        const path: keyof paths = '/api/privatperson/me/wettbewerbskontext';
        return this.#httpClient.get<PrivatpersonWettbewerbskontext>(this.#config.apiUrl + path, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }
}
