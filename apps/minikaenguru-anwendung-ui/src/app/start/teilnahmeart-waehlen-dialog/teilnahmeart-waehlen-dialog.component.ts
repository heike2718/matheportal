import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { GewaehlteTeilnahmeart } from './teilnahmeart-vaehlen-dialog.model';

@Component({
    selector: 'mka-teilnahmeart-waehlen-dialog',
    imports: [DialogModule],
    templateUrl: './teilnahmeart-waehlen-dialog.component.html',
    styleUrl: './teilnahmeart-waehlen-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeilnahmeartWaehlenDialogComponent {
    readonly #dialogRef = inject(DialogRef) as DialogRef<GewaehlteTeilnahmeart>;

    selectSchule(): void {
        this.#close('schule');
    }

    selectPrivat(): void {
        this.#close('privat');
    }

    selectNichtTeilnehmen(): void {
        this.#close('nicht_teilnehmen');
    }

    #close(teilnahmeart: GewaehlteTeilnahmeart): void {
        this.#dialogRef.close(teilnahmeart);
    }
}
