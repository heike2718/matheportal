import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';

@Component({
    imports: [NxWelcome, RouterModule],
    selector: 'portal-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    protected title = 'portal-shell';
}
