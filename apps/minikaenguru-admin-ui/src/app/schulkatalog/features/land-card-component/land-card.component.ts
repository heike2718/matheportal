import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Land } from '../../model/schulkatalog.model';

@Component({
    selector: 'mk-admin-land-card',
    imports: [],
    templateUrl: './land-card.component.html',
    styleUrl: './land-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandCardComponent {
    readonly land = input.required<Land>();
    readonly landSelected = output<Land>();
}
