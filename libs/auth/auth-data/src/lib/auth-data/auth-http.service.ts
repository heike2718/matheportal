import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_CONFIGURATION, AuthUrlResponse } from '@matheportal/auth-model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthHttpService {
    #config = inject(AUTH_CONFIGURATION);
    #http = inject(HttpClient);

    /**
     * Holt die redirect-URL zum IAM.
     * @returns Observable
     */
    getLoginUrl(): Observable<AuthUrlResponse> {
        return this.#http.get<AuthUrlResponse>(this.#config.apiUrl + '/authurls/login');
    }

    /**
     * löscht die Session.
     * @returns Observable
     */
    logOut(): Observable<void> {
        return this.#http.delete<void>(this.#config.apiUrl + '/session');
    }
}
