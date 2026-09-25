import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchulkatalogantragDialogComponent } from './schulkatalogantrag-dialog.component';
import { Schulkatalogantrag } from '../../model/schulkatalogantrag.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { By } from '@angular/platform-browser';

describe('SchulkatalogantragDialogComponent', () => {
    const antrag: Schulkatalogantrag = {
        emailAuftraggeber: 'test@provider.de',
        nameLand: 'Schweiz',
        nameOrt: 'Winterthur',
        nameSchule: 'Primarschule Kirchgässli',
        plz: '7645',
        strasseUndHausnummer: 'Kirchgässli 12',
    };

    let component: SchulkatalogantragDialogComponent;
    let fixture: ComponentFixture<SchulkatalogantragDialogComponent>;

    const dialogRefMock = {
        close: vi.fn(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SchulkatalogantragDialogComponent],
            providers: [
                {
                    provide: DIALOG_DATA,
                    useValue: antrag,
                },
                {
                    provide: DialogRef,
                    useValue: dialogRefMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SchulkatalogantragDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();

        vi.resetAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show the correct title', () => {
        const titleDe = fixture.debugElement.query(By.css('.schulkatalogantrag-dialog__title'));

        expect(titleDe).toBeTruthy();
        expect(titleDe.nativeElement.textContent.trim()).toBe('Schule eintragen lassen');
    });

    it('should close the dialog without result when abbrechen is called', () => {
        component.abbrechen();

        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith();
    });

    it('should close the dialog with the form values when anlegen is called with valid form', () => {
        component.form.patchValue(antrag);

        component.submit();

        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith(antrag);
    });

    it('should not close the dialog when the form is invalid', () => {
        component.form.controls.nameLand.setValue('');

        component.submit();

        expect(dialogRefMock.close).not.toHaveBeenCalled();
    });

    it('should mark all controls as touched when anlegen is called with invalid form', () => {
        component.form.controls.nameLand.setValue('');

        component.submit();

        expect(component.form.controls.emailAuftraggeber.touched).toBe(true);
        expect(component.form.controls.nameLand.touched).toBe(true);
        expect(component.form.controls.nameOrt.touched).toBe(true);
        expect(component.form.controls.nameSchule.touched).toBe(true);
        expect(component.form.controls.plz.touched).toBe(true);
        expect(component.form.controls.strasseUndHausnummer.touched).toBe(true);
    });

    describe('validation', () => {
        it.each(['nameLand', 'nameOrt', 'nameSchule', 'plz', 'strasseUndHausnummer'] as const)(
            'should require %s',
            controlName => {
                const control = component.form.controls[controlName];

                control.setValue('');

                expect(control.hasError('required')).toBe(true);
            }
        );

        it.each(['nameLand', 'nameOrt', 'nameSchule', 'plz', 'strasseUndHausnummer'] as const)(
            'should reject unsupported characters in %s',
            controlName => {
                const control = component.form.controls[controlName];

                control.setValue('Москва');

                expect(control.hasError('pattern')).toBe(true);
            }
        );

        it.each(['nameLand', 'nameOrt', 'nameSchule'] as const)(
            'should reject %s longer than 100 characters',
            controlName => {
                const control = component.form.controls[controlName];

                control.setValue('A'.repeat(101));

                expect(control.hasError('maxlength')).toBe(true);
            }
        );

        it('should reject plz longer than 20 characters', () => {
            const control = component.form.controls.plz;

            control.setValue('0123456789 0123456789');

            expect(control.hasError('maxlength')).toBe(true);
        });

        it('should reject strasseUndHausnummer longer than 200 characters', () => {
            const control = component.form.controls.strasseUndHausnummer;

            control.setValue(
                'Dies ist ein beispielhafter, langer String in Java, der exakt eine Länge von zweihunderteins Zeichen besitzt, um ihn direkt in deinem Code für Tests oder als Platzhalter zu verwenden. Er passt perfekt!'
            );

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
        it('should show the correct button label', () => {
            fixture.detectChanges();

            const buttonDe = fixture.debugElement.query(By.css('[data-testid="submit-btn"]'));

            expect(buttonDe.nativeElement.textContent.trim()).toBe('Eintrag beantragen');
        });

        it('should be enabled when the form is valid', () => {
            fixture.detectChanges();

            const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

            expect(button.disabled).toBe(false);
        });

        it('should not be disabled when the form is invalid', () => {
            component.form.controls.nameLand.setValue('');
            fixture.detectChanges();

            const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

            expect(button.disabled).toBe(false);
        });
    });
});
