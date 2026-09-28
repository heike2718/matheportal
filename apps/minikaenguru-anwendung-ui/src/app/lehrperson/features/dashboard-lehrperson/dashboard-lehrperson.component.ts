import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LehrpersonFacade } from '../../api/lehrperson.facade';

@Component({
    selector: 'mka-dashboard-lehrperson',
    imports: [],
    templateUrl: './dashboard-lehrperson.component.html',
    styleUrl: './dashboard-lehrperson.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLehrpersonComponent {
    readonly lehrpersonFacade = inject(LehrpersonFacade);
}
