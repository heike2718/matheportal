import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SchuleCardComponent } from '../../../shared/components/schule-card-component/schule-card.component';
import { Schule } from '../../../core/model/schulkatalog.model';

@Component({
    selector: 'mka-lehrperson-schulen',
    imports: [SchuleCardComponent],
    templateUrl: './lehrperson-schulen.component.html',
    styleUrl: './lehrperson-schulen.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LehrpersonSchulenComponent {
    readonly schulen = input.required<Schule[]>();
    readonly schulenLoaded = input.required<boolean>();

    readonly schuleSelected = output<Schule>();
    // readonly zurueckZurSchulauswahlRequested = output<void>();
}
