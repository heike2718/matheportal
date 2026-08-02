import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Schule } from '../../model/schulkatalog.model';

@Component({
    selector: 'mka-schule-card',
    imports: [],
    templateUrl: './schule-card.component.html',
    styleUrl: './schule-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchuleCardComponent {
    readonly schule = input.required<Schule>();
    readonly schuleSelected = output<Schule>();
}
