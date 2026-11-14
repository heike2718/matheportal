import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
    AuswertungsartDialogData,
    AuswertungsartDialogResult,
    AUSWERUNGSART,
} from '../../../teilnahme/model/teilnahme.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { getAktuelleAuswertungsart, getShowOfflineSection, getShowOnlineSection } from './auswertungsart-dialog.utils';

@Component({
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './auswertungsart-dialog.component.html',
    styleUrl: './auswertungsart-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuswertungsartDialogComponent {
    readonly #dialogRef = inject<DialogRef<AuswertungsartDialogResult>>(DialogRef);

    readonly data = inject<AuswertungsartDialogData>(DIALOG_DATA);

    readonly loeschungErforderlich = this.data.loesungszettelVorhanden;

    readonly aktuelleAuswertungsart = getAktuelleAuswertungsart(this.data);

    readonly showOnlineSection = getShowOnlineSection(this.data);

    readonly showOfflineSection = getShowOfflineSection(this.data);

    selectOffline(): void {
        const result: AuswertungsartDialogResult = {
            schulkuerzel: this.data.schulkuerzel,
            gewaehlteAuswertungsart: AUSWERUNGSART.offline,
        };
        this.#dialogRef.close(result);
    }

    selectOnline(): void {
        const result: AuswertungsartDialogResult = {
            schulkuerzel: this.data.schulkuerzel,
            gewaehlteAuswertungsart: AUSWERUNGSART.online,
        };
        this.#dialogRef.close(result);
    }

    selectAbbrechen(): void {
        this.#dialogRef.close(undefined);
    }
}
