import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { MinikaenguruContextFacade } from '../core/context/minikaenguru-context.facade';
import { DashboardLehrerComponent } from '../dashboard-lehrer/dashboard-lehrer.component';
import { DashboardPrivatComponent } from '../dashboard-privat/dashboard-privat.component';

@Component({
    selector: 'mka-start',
    imports: [GuestInfoComponent, DashboardLehrerComponent, DashboardPrivatComponent],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent {
    readonly minikaenguruContextFacade = inject(MinikaenguruContextFacade);
}
