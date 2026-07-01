import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { GewaehlteDurchfuehrungsart } from './durchfuehrungsart-waehlen.model';

@Component({
    selector: 'mka-durchfuehrungsart-waehlen',
    imports: [],
    templateUrl: './durchfuehrungsart-waehlen.component.html',
    styleUrl: './durchfuehrungsart-waehlen.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurchfuehrungsartWaehlenComponent {
    readonly durchfuehrungsartGewaehlt = output<GewaehlteDurchfuehrungsart>();

    selectSchule(): void {
        this.durchfuehrungsartGewaehlt.emit('schule');
    }

    selectPrivat(): void {
        this.durchfuehrungsartGewaehlt.emit('privat');
    }
}
