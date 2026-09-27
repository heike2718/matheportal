import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../config/minikaenguru-anwendung.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schule } from '../model/schulkatalog.model';

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
}
