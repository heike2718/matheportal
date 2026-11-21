import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Klasse } from '../../model/klasse.model';
import { KlasseCardComponent } from '../klasse-card/klasse-card.component';

@Component({
    selector: 'mka-klassen-list',
    imports: [KlasseCardComponent, MatButtonModule],
    templateUrl: './klassen-list.component.html',
    styleUrl: './klassen-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlassenListComponent {
    readonly klassen = input.required<Klasse[]>();
    readonly klasseSelected = output<Klasse>();
    readonly klassenlisteHochladen = output<void>();
    readonly klasseAnlegen = output<void>();
    readonly alleKlassenLoeschen = output<void>();
}
