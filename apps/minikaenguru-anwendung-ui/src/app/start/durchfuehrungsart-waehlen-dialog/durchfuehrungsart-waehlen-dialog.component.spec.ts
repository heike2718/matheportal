import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef } from '@angular/cdk/dialog';
import { DurchfuehrungsartWaehlenDialogComponent } from './durchfuehrungsart-waehlen-dialog.component';
import { By } from '@angular/platform-browser';
import { GEWAEHLTE_DURCHFUEHRUNGSART } from './durchfuehrungsart-waehlen-dialog.model';

describe('DurchfuehrungsartWaehlenDialogComponent', () => {
    let component: DurchfuehrungsartWaehlenDialogComponent;
    let fixture: ComponentFixture<DurchfuehrungsartWaehlenDialogComponent>;

    let dialogRefMock: {
        close: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        dialogRefMock = {
            close: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [DurchfuehrungsartWaehlenDialogComponent],
            providers: [{ provide: DialogRef, useValue: dialogRefMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(DurchfuehrungsartWaehlenDialogComponent);
        component = fixture.componentInstance;
    });

    it('should create and show the expected title and intro', () => {
        expect(component).toBeTruthy();

        const titleDe = fixture.debugElement.query(By.css('.durchfuehrungsart-dialog__title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Durchführungsart wählen');

        const introDe = fixture.debugElement.query(By.css('.durchfuehrungsart-dialog__intro'));
        expect(introDe.nativeElement.textContent.trim()).toBe(
            'Sie sind angemeldet, haben aber noch kein Minikängurukonto. Bitte wählen Sie aus, wie Sie Minikänguru nutzen möchten.'
        );

        expect(fixture.debugElement.query(By.css('.durchfuehrungsart-dialog__intro'))).toBeTruthy();
    });

    it('should show the option schule and call selectSchule when clicked', () => {
        expect(component).toBeTruthy();
        const optionDe = fixture.debugElement.query(By.css('[data-testid="mka-durchfuehrungsart-schule"]'));

        const titleDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Schule');

        const textDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-text'));
        expect(textDe).toBeTruthy();
        expect(textDe.nativeElement.textContent.trim()).toBe(
            'Sie organisieren den Wettbewerb für eine oder mehrere Klassen einer Schule.'
        );

        optionDe.triggerEventHandler('click');
        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith(GEWAEHLTE_DURCHFUEHRUNGSART.schule);
    });

    it('should show the option privat and call selectPrivat when clicked', () => {
        expect(component).toBeTruthy();
        const optionDe = fixture.debugElement.query(By.css('[data-testid="mka-durchfuehrungsart-privat"]'));

        const titleDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Privat');

        const textDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-text'));
        expect(textDe).toBeTruthy();
        expect(textDe.nativeElement.textContent.trim()).toBe(
            'Sie lassen ein oder mehrere Kinder ohne Schule am Wettbewerb teilnehmen.'
        );

        optionDe.triggerEventHandler('click');
        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith(GEWAEHLTE_DURCHFUEHRUNGSART.privat);
    });

    it('should show the option none and call selectNone when clicked', () => {
        expect(component).toBeTruthy();
        const optionDe = fixture.debugElement.query(By.css('[data-testid="mka-durchfuehrungsart-nicht-teilnehmen"]'));

        const titleDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Nicht jetzt');

        const textDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-text'));
        expect(textDe).toBeTruthy();
        expect(textDe.nativeElement.textContent.trim()).toBe('Es wird kein Minikängurukonto angelegt.');

        optionDe.triggerEventHandler('click');
        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith(GEWAEHLTE_DURCHFUEHRUNGSART.none);
    });
});
