import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Auswertungsart, Person, Teilnahme } from '../../model/teilnahme.model';
import { Observable } from 'rxjs';
import { paths } from '../../../generated/api-types';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';
import { Klasse } from '../model/klasse.model';

@Injectable()
export class SchulteilnahmeHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

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

    /**
     * Läd die Person, die diese Schule zum Wettbewerb angemeldet hat.
     * @param schulkuerzel string
     * @returns Observable auf Person
     */
    public loadAnmeldendePerson(schulkuerzel: string): Observable<Person> {
        const pathTemplate: keyof paths = '/api/schulen/{schuleId}/aktuelle-teilnahme/anmeldende-person';
        const path = pathTemplate.replace('{schuleId}', schulkuerzel);
        return this.#httpClient.get<Person>(this.#config.apiUrl + path, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }

    /**
     * Läd die Klassen dieser Schule.
     * @param schulkuerzel string
     * @returns Observable auf ein Klasse-Array
     */
    public loadKlassen(schulkuerzel: string): Observable<Klasse[]> {
        const pathTemplate: keyof paths = '/api/schulen/{schuleId}/klassen';
        const path = pathTemplate.replace('{schuleId}', schulkuerzel);
        return this.#httpClient.get<Klasse[]>(this.#config.apiUrl + path, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }
}
