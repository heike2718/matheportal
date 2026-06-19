import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
    selector: 'rbk-start',
    imports: [AsyncPipe, GuestInfoComponent, DashboardComponent],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent {
    authSessionFacade = inject(AuthSessionFacade);
}
