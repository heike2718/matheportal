import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { DashboardLehrerComponent } from '../dashboard-lehrer/dashboard-lehrer.component';
import { DashboardPrivatComponent } from '../dashboard-privat/dashboard-privat.component';
import { MkaAuthorizationFacade } from '../core/authorization/authorization-api/mka-authorization.facade';

@Component({
    selector: 'mka-start',
    imports: [GuestInfoComponent, DashboardLehrerComponent, DashboardPrivatComponent],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
    readonly mkaAuthorizationFacade = inject(MkaAuthorizationFacade);

    ngOnInit(): void {
        this.mkaAuthorizationFacade.ensureAuthorizationLoaded();
    }
}
