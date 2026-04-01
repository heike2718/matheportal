import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    imports: [RouterModule],
    selector: 'portal-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    protected title = 'portal-shell';
}
