import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BrowserNavigationService {
    redirectToUrl(url: string): void {
        window.location.href = url;
    }
}
