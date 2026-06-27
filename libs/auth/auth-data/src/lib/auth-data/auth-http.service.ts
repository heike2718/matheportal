import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_CONFIGURATION, AuthUrlResponse, User } from '@matheportal/auth-model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthHttpService {
    #config = inject(AUTH_CONFIGURATION);
    #http = inject(HttpClient);

    /**
     * Holt die login-redirect-URL zum IAM.
     * @returns Observable
     */
    getLoginUrl(): Observable<AuthUrlResponse> {
        return this.#http.get<AuthUrlResponse>(this.#config.apiUrl + '/api/authurls/login');
    }

    /**
     * Holt die signup-redirect-URL zum IAM.
     * @returns Observable
     */
    getSignupUrl(): Observable<AuthUrlResponse> {
        return this.#http.get<AuthUrlResponse>(this.#config.apiUrl + '/api/authurls/signup');
    }

    /**
     * löscht die Session.
     * @returns Observable
     */
    logOut(): Observable<void> {
        return this.#http.delete<void>(this.#config.apiUrl + '/api/session');
    }

    /**
     * erzegt die session.
     * @param idToken string
     * @returns Observable
     */
    createSession(idToken: string): Observable<User> {
        return this.#http.post<User>(this.#config.apiUrl + '/api/session', { idToken });
    }

    /**
     * läd die Session neu, sofern es eine gibt
     * @returns Observable
     */
    reloadSession(): Observable<User> {
        return this.#http.put<User>(this.#config.apiUrl + '/api/session', {});
    }
}
