import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthSessionFacade } from '@matheportal/auth-api';

@Component({
    selector: 'portal-home',
    imports: [RouterModule, MatCardModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    authSessionFacade = inject(AuthSessionFacade);
}
