import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { User } from '@matheportal/auth-model';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';
import { paths } from '../../../generated/api-types';

// kein providedIn: 'root', aber mittels mkaAuthorizationDataProvider in den remote.routes.ts im remote-Kontext
// providen, damit die remotespezifische #config gezogen wird.
@Injectable()
export class MkaAuthorizationHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    public loadMkaAuthorization(): Observable<User> {
        const path: keyof paths = '/api/berechtigungen';

        return this.#httpClient.get<User>(this.#config.apiUrl + path, {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
            withCredentials: true,
        });
    }
}
