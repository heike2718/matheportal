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

    public getLoginUrl(): Observable<AuthUrlResponse> {
        return this.#http.get<AuthUrlResponse>(this.#config.apiUrl + '/authurls/login');
    }
}
