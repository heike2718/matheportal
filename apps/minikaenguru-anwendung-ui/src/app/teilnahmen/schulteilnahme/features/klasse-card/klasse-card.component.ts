import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Klasse } from '../../model/klasse.model';

@Component({
    selector: 'mka-klasse-card',
    imports: [],
    templateUrl: './klasse-card.component.html',
    styleUrl: './klasse-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlasseCardComponent {
    readonly klasse = input.required<Klasse>();
    readonly klasseSelected = output<Klasse>();
}
