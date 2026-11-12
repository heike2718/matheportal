import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Auswertungsart, AuswertungsartDialogData } from '../../../teilnahme/model/teilnahme.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './auswertungsart-dialog.component.html',
    styleUrl: './auswertungsart-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuswertungsartDialogComponent {
    readonly #dialogRef = inject<DialogRef<Auswertungsart>>(DialogRef);

    readonly data = inject<AuswertungsartDialogData>(DIALOG_DATA);

    readonly loeschungErforderlich = this.data.klassenVorhanden;

    selectOffline(): void {
        this.#dialogRef.close('OFFLINE');
    }

    selectOnline(): void {
        this.#dialogRef.close('ONLINE');
    }

    selectAbbrechen(): void {
        this.#dialogRef.close();
    }
}
