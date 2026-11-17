import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LehrpersonFacade } from '../../api/lehrperson.facade';
import { LehrpersonSchulenComponent } from '../lehrperson-schulen-component/lehrperson-schulen.component';
import { Schule } from '../../../core/model/schulkatalog.model';

@Component({
    imports: [LehrpersonSchulenComponent],
    templateUrl: './lehrperson-dashboard.component.html',
    styleUrl: './lehrperson-dashboard.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LehrpersonDashboardComponent {
    readonly lehrpersonFacade = inject(LehrpersonFacade);
    readonly isSchulenLoaded = this.lehrpersonFacade.isSchulenLoaded;
    readonly schulen = this.lehrpersonFacade.schulen;

    public onSchuleSelected(schule: Schule): void {
        this.lehrpersonFacade.schuleAusgewaehlt(schule);
    }
}
