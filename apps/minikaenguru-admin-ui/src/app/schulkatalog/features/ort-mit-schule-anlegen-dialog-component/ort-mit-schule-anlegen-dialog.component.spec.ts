import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrtMitSchuleAnlegenDialogComponent } from './ort-mit-schule-anlegen-dialog.component';
import { OrtMitSchuleAnlegenDialogData, OrtMitSchuleAnlegenRequest } from '../../model/schulkatalog.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { By } from '@angular/platform-browser';

describe('OrtMitSchuleAnlegenDialogComponent', () => {
    let component: OrtMitSchuleAnlegenDialogComponent;
    let fixture: ComponentFixture<OrtMitSchuleAnlegenDialogComponent>;

    const payload: OrtMitSchuleAnlegenRequest = {
        emailAuftraggeber: 'heike@example.org',
        nameOrt: 'Mainz',
        nameSchule: 'Testschule',
    };

    const data: OrtMitSchuleAnlegenDialogData = {
        land: {
            kuerzel: 'AU',
            name: 'Österreich',
            anzahlOrte: 24,
        },
        payload,
    };

    const dialogRefMock = {
        close: vi.fn(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrtMitSchuleAnlegenDialogComponent],
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

        fixture = TestBed.createComponent(OrtMitSchuleAnlegenDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();

        vi.resetAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show the correct title', () => {
        const titleDe = fixture.debugElement.query(By.css('.ort-mit-schule-dialog__title'));

        expect(titleDe).toBeTruthy();
        expect(titleDe.nativeElement.textContent.trim()).toBe('Ort mit Schule in Österreich anlegen');
    });

    it('should close the dialog without result when abbrechen is called', () => {
        component.abbrechen();

        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith();
    });

    it('should close the dialog with the form values when anlegen is called with valid form', () => {
        component.form.patchValue({
            emailAuftraggeber: 'neu@example.org',
            nameOrt: 'Wien',
            nameSchule: 'Testschule Wien',
        });

        component.anlegen();

        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith({
            emailAuftraggeber: 'neu@example.org',
            nameOrt: 'Wien',
            nameSchule: 'Testschule Wien',
        });
    });

    it('should not close the dialog when the form is invalid', () => {
        component.form.controls.nameOrt.setValue('');

        component.anlegen();

        expect(dialogRefMock.close).not.toHaveBeenCalled();
    });

    it('should mark all controls as touched when anlegen is called with invalid form', () => {
        component.form.controls.nameOrt.setValue('');

        component.anlegen();

        expect(component.form.controls.emailAuftraggeber.touched).toBe(true);
        expect(component.form.controls.nameOrt.touched).toBe(true);
        expect(component.form.controls.nameSchule.touched).toBe(true);
    });

    describe('validation', () => {
        it.each(['nameOrt', 'nameSchule'] as const)('should require %s', controlName => {
            const control = component.form.controls[controlName];

            control.setValue('');

            expect(control.hasError('required')).toBe(true);
        });

        it.each(['nameOrt', 'nameSchule'] as const)('should reject unsupported characters in %s', controlName => {
            const control = component.form.controls[controlName];

            control.setValue('Москва');

            expect(control.hasError('pattern')).toBe(true);
        });

        it.each(['nameOrt', 'nameSchule'] as const)('should reject %s longer than 100 characters', controlName => {
            const control = component.form.controls[controlName];

            control.setValue('A'.repeat(101));

            expect(control.hasError('maxlength')).toBe(true);
        });

        it('should require emailAuftraggeber', () => {
            const control = component.form.controls.emailAuftraggeber;

            control.setValue('');

            expect(control.hasError('required')).toBe(true);
        });

        it('should reject invalid emailAuftraggeber', () => {
            const control = component.form.controls.emailAuftraggeber;

            control.setValue('keine-email');

            expect(control.hasError('pattern')).toBe(true);
        });

        it('should reject emailAuftraggeber longer than 255 characters', () => {
            const control = component.form.controls.emailAuftraggeber;

            control.setValue(`${'a'.repeat(244)}@example.org`);

            expect(control.hasError('maxlength')).toBe(true);
        });
    });

    describe('submit button', () => {
        it('should be enabled when the form is valid', () => {
            fixture.detectChanges();

            const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

            expect(button.disabled).toBe(false);
            expect(button.textContent.trim()).toBe('anlegen');
        });

        it('should not be disabled when the form is invalid', () => {
            component.form.controls.nameOrt.setValue('');
            fixture.detectChanges();

            const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

            expect(button.disabled).toBe(false);
        });
    });
});
