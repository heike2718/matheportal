import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { LAND_KUERZEL_PATTERN, LandMitOrtUndSchuleAnlegenRequest } from '../../model/schulkatalog.model';
import {
    MINIKAENGURU_EMAIL_PATTERN,
    MINIKAENGURU_TEXT_PATTERN,
    MINIKAENGURU_TEXT_VALIDATION_HINT,
} from '@matheportal/shared-utils';

@Component({
    imports: [ReactiveFormsModule, DialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './land-mit-ort-und-schule-anlegen-dialog.component.html',
    styleUrl: './land-mit-ort-und-schule-anlegen-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandMitOrtUndSchuleAnlegenDialogComponent {
    readonly validationHint = MINIKAENGURU_TEXT_VALIDATION_HINT;

    private readonly formBuilder = inject(FormBuilder);

    private readonly dialogRef = inject<DialogRef<LandMitOrtUndSchuleAnlegenRequest>>(DialogRef);

    private readonly payload = inject<LandMitOrtUndSchuleAnlegenRequest>(DIALOG_DATA);

    readonly form = this.formBuilder.nonNullable.group({
        emailAuftraggeber: [
            this.payload.emailAuftraggeber,
            [Validators.required, Validators.maxLength(255), Validators.pattern(MINIKAENGURU_EMAIL_PATTERN)],
        ],
        kuerzelLand: [
            this.payload.kuerzelLand,
            [Validators.required, Validators.maxLength(5), Validators.pattern(LAND_KUERZEL_PATTERN)],
        ],
        nameLand: [
            this.payload.nameLand,
            [Validators.required, Validators.maxLength(100), Validators.pattern(MINIKAENGURU_TEXT_PATTERN)],
        ],
        nameOrt: [
            this.payload.nameOrt,
            [Validators.required, Validators.maxLength(100), Validators.pattern(MINIKAENGURU_TEXT_PATTERN)],
        ],
        nameSchule: [
            this.payload.nameSchule,
            [Validators.required, Validators.maxLength(100), Validators.pattern(MINIKAENGURU_TEXT_PATTERN)],
        ],
    });

    abbrechen(): void {
        this.dialogRef.close();
    }

    anlegen(): void {
        if (this.form.invalid || this.form.pending) {
            this.form.markAllAsTouched();
            return;
        }

        const payload: LandMitOrtUndSchuleAnlegenRequest = {
            ...this.payload,
            ...this.form.getRawValue(),
        };

        this.dialogRef.close(payload);
    }
}
