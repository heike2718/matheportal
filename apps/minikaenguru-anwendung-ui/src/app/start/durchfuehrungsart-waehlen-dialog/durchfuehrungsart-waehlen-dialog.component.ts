import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { GewaehlteDurchfuehrungsart } from './durchfuehrungsart-waehlen-dialog.model';

@Component({
    selector: 'mka-durchfuehrungsart-waehlen-dialog',
    imports: [DialogModule],
    templateUrl: './durchfuehrungsart-waehlen-dialog.component.html',
    styleUrl: './durchfuehrungsart-waehlen-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurchfuehrungsartWaehlenDialogComponent {
    readonly #dialogRef = inject(DialogRef) as DialogRef<GewaehlteDurchfuehrungsart>;

    selectSchule(): void {
        this.#close('schule');
    }

    selectPrivat(): void {
        this.#close('privat');
    }

    selectNichtTeilnehmen(): void {
        this.#close('nicht_durchfuehren');
    }

    #close(durchfuehrungsart: GewaehlteDurchfuehrungsart): void {
        this.#dialogRef.close(durchfuehrungsart);
    }
}
