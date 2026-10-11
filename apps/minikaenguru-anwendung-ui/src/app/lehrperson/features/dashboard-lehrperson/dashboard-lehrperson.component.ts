import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LehrpersonFacade } from '../../api/lehrperson.facade';
import { LehrpersonSchulenComponent } from '../lehrperson-schulen-component/lehrperson-schulen.component';
import { Schule } from '../../../core/model/schulkatalog.model';

@Component({
    selector: 'mka-dashboard-lehrperson',
    imports: [LehrpersonSchulenComponent],
    templateUrl: './dashboard-lehrperson.component.html',
    styleUrl: './dashboard-lehrperson.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLehrpersonComponent {
    readonly lehrpersonFacade = inject(LehrpersonFacade);
    readonly isSchulenLoaded = this.lehrpersonFacade.isSchulenLoaded;
    readonly schulen = this.lehrpersonFacade.schulen;

    public onSchuleSelected(schule: Schule): void {
        this.lehrpersonFacade.schuleAusgewaehlt(schule);
    }
}
