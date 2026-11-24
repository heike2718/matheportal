import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
    MINIKAENGURU_TEXT_PATTERN,
    MINIKAENGURU_TEXT_VALIDATION_HINT,
    notBlankValidator,
} from '@matheportal/shared-utils';
import { KlasseDialogData, KlasseDialogResult, KlasseRequest } from '../../model/klasse.model';

@Component({
    imports: [ReactiveFormsModule, DialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './klasse-dialog.component.html',
    styleUrl: './klasse-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlasseDialogComponent {
    readonly validationHint = MINIKAENGURU_TEXT_VALIDATION_HINT;

    private readonly formBuilder = inject(FormBuilder);

    private readonly dialogRef = inject<DialogRef<KlasseRequest>>(DialogRef);

    readonly data = inject<KlasseDialogData>(DIALOG_DATA);

    readonly form = this.formBuilder.nonNullable.group({
        name: [
            this.data.name,
            [
                Validators.required,
                notBlankValidator,
                Validators.maxLength(55),
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

        const payload: KlasseRequest = {
            ...this.form.getRawValue(),
        };

        const dialogResult: KlasseDialogResult = {
            schulkuerzel: this.data.schulkuerzel,
            name: payload.name,
        };

        this.dialogRef.close(dialogResult);
    }
}
