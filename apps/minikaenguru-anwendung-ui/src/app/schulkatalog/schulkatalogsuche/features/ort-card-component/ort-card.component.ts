import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Ort } from '../../model/schulkatalog.model';

@Component({
    selector: 'mka-ort-card',
    imports: [],
    templateUrl: './ort-card.component.html',
    styleUrl: './ort-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrtCardComponent {
    readonly ort = input.required<Ort>();
    readonly ortSelected = output<Ort>();
}
