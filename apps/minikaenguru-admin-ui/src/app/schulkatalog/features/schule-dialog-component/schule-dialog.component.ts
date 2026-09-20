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
    notBlankValidator,
} from '@matheportal/shared-utils';
import { SchuleDialogData, SchuleAnlegenOderAendernRequest } from '../../model/schulkatalog.model';

@Component({
    imports: [ReactiveFormsModule, DialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './schule-dialog.component.html',
    styleUrl: './schule-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchuleDialogComponent {
    readonly validationHint = MINIKAENGURU_TEXT_VALIDATION_HINT;

    private readonly formBuilder = inject(FormBuilder);

    private readonly dialogRef = inject<DialogRef<SchuleAnlegenOderAendernRequest>>(DialogRef);

    readonly data = inject<SchuleDialogData>(DIALOG_DATA);

    readonly form = this.formBuilder.nonNullable.group({
        emailAuftraggeber: [
            this.data.payload.emailAuftraggeber,
            [Validators.required, Validators.maxLength(255), Validators.pattern(MINIKAENGURU_EMAIL_PATTERN)],
        ],
        nameSchule: [
            this.data.payload.name,
            [
                Validators.required,
                notBlankValidator,
                Validators.maxLength(100),
                Validators.pattern(MINIKAENGURU_TEXT_PATTERN),
            ],
        ],
    });

    abbrechen(): void {
        this.dialogRef.close();
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload: SchuleAnlegenOderAendernRequest = {
            ...this.data.payload,
            ...this.form.getRawValue(),
        };

        this.dialogRef.close(payload);
    }
}
