import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../config/minikaenguru-anwendung.configuration';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auswertungsart, Teilnahme } from '../model/teilnahme.model';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';
import { paths } from '../../generated/api-types';

@Injectable()
export class TeilnahmeHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    /**
     * Meldet die eingeloggte Privatperson zum aktuellen Wettbewerb an.
     * @returns Observable auf Teilnahme
     */
    public privatAnmelden(): Observable<Teilnahme> {
        const path: keyof paths = '/api/privatperson/me/aktuelle-teilnahme';
        return this.#httpClient.post<Teilnahme>(this.#config.apiUrl + path, null, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }

    /**
     * Läd die Daten der aktuellen Teilnahme der eingeloggten Privatperson.
     * @returns Observable auf Teilnahme
     */
    public loadAktuellePrivatteilnahme(): Observable<Teilnahme> {
        const path: keyof paths = '/api/privatperson/me/aktuelle-teilnahme';
        return this.#httpClient.get<Teilnahme>(this.#config.apiUrl + path, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }

    /**
     * Meldet die Schule zum aktuellen Wettbewerb an.
     * @param schulkuerzel string
     * @param auswertungsart beabsichtigte Auswertungsart
     * @returns Observable auf Teilnahme
     */
    public schuleAnmelden(schulkuerzel: string, auswertungsart: Auswertungsart): Observable<Teilnahme> {
        const pathTemplate: keyof paths = '/api/schulen/{schuleId}/aktuelle-teilnahme';
        const path = pathTemplate.replace('{schuleId}', schulkuerzel);
        return this.#httpClient.post<Teilnahme>(this.#config.apiUrl + path, null, {
            params: new HttpParams().set('auswertungsart', auswertungsart),
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }

    /**
     * Läd die Daten der aktuellen Teilnahme der Schule.
     * @returns Observable auf Teilnahme
     */
    public loadAktuelleSchulteilnahme(schulkuerzel: string): Observable<Teilnahme> {
        const pathTemplate: keyof paths = '/api/schulen/{schuleId}/aktuelle-teilnahme';
        const path = pathTemplate.replace('{schuleId}', schulkuerzel);
        return this.#httpClient.get<Teilnahme>(this.#config.apiUrl + path, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }
}
