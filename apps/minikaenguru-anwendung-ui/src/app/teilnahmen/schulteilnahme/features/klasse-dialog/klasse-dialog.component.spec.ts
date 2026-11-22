import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KlasseDialogComponent } from './klasse-dialog.component';
import { KlasseDialogData } from '../../model/klasse.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { By } from '@angular/platform-browser';

describe('KlasseDialogComponent', () => {
    let component: KlasseDialogComponent;
    let fixture: ComponentFixture<KlasseDialogComponent>;

    const data: KlasseDialogData = {
        schulkuerzel: 'S1234567',
        name: 'Fuchsklasse',
        submitButtonLabel: 'hallihallo',
    };

    const dialogRefMock = {
        close: vi.fn(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KlasseDialogComponent],
            providers: [
                {
                    provide: DIALOG_DATA,
                    useValue: data,
                },
                {
                    provide: DialogRef,
                    useValue: dialogRefMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(KlasseDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();

        vi.resetAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show the correct title', () => {
        const titleDe = fixture.debugElement.query(By.css('.klasse-dialog__title'));

        expect(titleDe).toBeTruthy();
        expect(titleDe.nativeElement.textContent.trim()).toBe('Klasse hallihallo');
    });

    it('should show the correct cancel button label', () => {
        const buttonDe = fixture.debugElement.query(By.css('[data-testid="cancel-btn"]'));

        expect(buttonDe).toBeTruthy();
        expect(buttonDe.nativeElement.textContent.trim()).toBe('abbrechen');
    });

    it('should show the correct submit button label', () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

        expect(button).toBeTruthy();
        expect(button.textContent.trim()).toBe('hallihallo');
    });

    it('should close the dialog without result when abbrechen is called', () => {
        component.abbrechen();

        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith();
    });

    it('should close the dialog with the form values when submit is called with valid form', () => {
        component.form.patchValue({
            name: 'Tuxklasse',
        });

        component.submit();

        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith({
            schulkuerzel: 'S1234567',
            name: 'Tuxklasse',
        });
    });

    it('should not close the dialog when the form is invalid', () => {
        component.form.controls.name.setValue('');

        component.submit();

        expect(dialogRefMock.close).not.toHaveBeenCalled();
    });

    it('should mark all controls as touched when anlegen is called with invalid form', () => {
        component.form.controls.name.setValue('');

        component.submit();

        expect(component.form.controls.name.touched).toBe(true);
    });

    describe('validation', () => {
        it('should require name', () => {
            const control = component.form.controls['name'];

            control.setValue('');

            expect(control.hasError('required')).toBe(true);
        });

        it('should reject unsupported characters in name', () => {
            const control = component.form.controls['name'];

            control.setValue('Лисы');

            expect(control.hasError('pattern')).toBe(true);
        });

        it('should reject name longer than 55 characters', () => {
            const control = component.form.controls['name'];

            control.setValue('A'.repeat(56));

            expect(control.hasError('maxlength')).toBe(true);
        });
    });

    describe('submit button', () => {
        it('should be enabled when the form is valid', () => {
            fixture.detectChanges();

            const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

            expect(button.disabled).toBe(false);
        });

        it('should not be disabled when the form is invalid', () => {
            component.form.controls.name.setValue('');
            fixture.detectChanges();

            const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

            expect(button.disabled).toBe(false);
        });
    });
});
