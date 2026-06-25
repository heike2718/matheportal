import { Injectable } from '@angular/core';
import { User } from '@matheportal/auth-model';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MkaAuthorizationHttpService {
    // #httpClient = inject(HttpClient);

    public loadMkaAuthorization(): Observable<User> {
        const user: User = {
            anonym: false,
            berechtigungen: ['STANDARD'],
            fullName: 'Standarduser',
        };

        return of(user);
    }
}
