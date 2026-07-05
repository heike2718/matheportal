import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { User } from '@matheportal/auth-model';

// kein providedIn: 'root', aber mittels mkaAuthorizationDataProvider in den remote.routes.ts im remote-Kontext
// providen, damit die remotespezifische #config gezogen wird.
@Injectable()
export class MkaAuthorizationHttpService {
    #config = inject(MINIKAENGURU_ANWENDUNG_CONFIGURATION);
    #httpClient = inject(HttpClient);

    public loadMkaAuthorization(): Observable<User> {
        return this.#httpClient.get<User>(this.#config.apiUrl + '/api/berechtigungen', { withCredentials: true });
    }
}
