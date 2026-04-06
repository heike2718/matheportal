import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent} from './layout/navbar/navbar.component';

@Component({
    imports: [RouterModule, NavbarComponent],
    selector: 'portal-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    protected title = 'portal-shell';
}
