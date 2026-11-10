import { inject, Injectable } from '@angular/core';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wettbewerb } from '../model/wettbewerb.model';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';
import { paths } from '../../../generated/api-types';

@Injectable()
export class WettbewerbHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    public loadWettbewerb(): Observable<Wettbewerb> {
        const path: keyof paths = '/api/wettbewerb';
        return this.#httpClient.get<Wettbewerb>(this.#config.apiUrl + path, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }
}
