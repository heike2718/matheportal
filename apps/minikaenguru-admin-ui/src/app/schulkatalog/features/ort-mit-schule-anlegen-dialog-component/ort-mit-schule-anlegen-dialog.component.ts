import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
    MINIKAENGURU_EMAIL_PATTERN,
    MINIKAENGURU_TEXT_PATTERN,
    MINIKAENGURU_TEXT_VALIDATION_HINT,
} from '@matheportal/shared-utils';
import { OrtMitSchuleAnlegenDialogData, OrtMitSchuleAnlegenRequest } from '../../model/schulkatalog.model';

@Component({
    imports: [ReactiveFormsModule, DialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './ort-mit-schule-anlegen-dialog.component.html',
    styleUrl: './ort-mit-schule-anlegen-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrtMitSchuleAnlegenDialogComponent {
    readonly validationHint = MINIKAENGURU_TEXT_VALIDATION_HINT;

    private readonly formBuilder = inject(FormBuilder);

    private readonly dialogRef = inject<DialogRef<OrtMitSchuleAnlegenRequest>>(DialogRef);

    readonly data = inject<OrtMitSchuleAnlegenDialogData>(DIALOG_DATA);

    readonly form = this.formBuilder.nonNullable.group({
        emailAuftraggeber: [
            this.data.payload.emailAuftraggeber,
            [Validators.required, Validators.maxLength(255), Validators.pattern(MINIKAENGURU_EMAIL_PATTERN)],
        ],
        nameOrt: [
            this.data.payload.nameOrt,
            [Validators.required, Validators.maxLength(100), Validators.pattern(MINIKAENGURU_TEXT_PATTERN)],
        ],
        nameSchule: [
            this.data.payload.nameSchule,
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

        const payload: OrtMitSchuleAnlegenRequest = {
            ...this.data.payload,
            ...this.form.getRawValue(),
        };

        this.dialogRef.close(payload);
    }
}
