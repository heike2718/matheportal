import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DurchfuehrungsartWaehlenComponent } from './durchfuehrungsart-waehlen.component';
import { By } from '@angular/platform-browser';

describe('DurchfuehrungsartWaehlenComponent', () => {
    let component: DurchfuehrungsartWaehlenComponent;
    let fixture: ComponentFixture<DurchfuehrungsartWaehlenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DurchfuehrungsartWaehlenComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DurchfuehrungsartWaehlenComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create and show the expected title and the intro', () => {
        expect(component).toBeTruthy();

        const titleDe = fixture.debugElement.query(By.css('.durchfuehrungsart__title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Durchführungsart wählen');

        const introDe = fixture.debugElement.query(By.css('.durchfuehrungsart__intro'));
        expect(introDe.nativeElement.textContent.trim()).toBe(
            'Sie sind eingeloggt, haben aber noch kein Minikängurukonto. Bitte wählen Sie aus, ob Sie den Wettbewerb mit einer oder mehreren Klassen einer Schule oder privat durchführen möchten.'
        );

        expect(fixture.debugElement.query(By.css('.durchfuehrungsart__intro'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('.durchfuehrungsart__hint'))).toBeTruthy();
    });

    it('should show the option schule and call selectSchule when clicked', () => {
        expect(component).toBeTruthy();
        const optionDe = fixture.debugElement.query(By.css('[data-testid="mka-durchfuehrungsart-schule"]'));

        const titleDe = optionDe.query(By.css('.durchfuehrungsart__option-title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Schule');

        const textDe = optionDe.query(By.css('.durchfuehrungsart__option-text'));
        expect(textDe).toBeTruthy();
        expect(textDe.nativeElement.textContent.trim()).toBe(
            'Ich möchte mit einer oder mehreren Klassen einer Schule am Wettbewerb teilnehmen.'
        );

        const emitted = vi.fn();
        component.durchfuehrungsartGewaehlt.subscribe(emitted);

        optionDe.triggerEventHandler('click');
        fixture.detectChanges();

        expect(emitted).toHaveBeenCalledOnce();
        expect(emitted).toHaveBeenCalledWith('schule');
    });

    it('should show the option privat and call selectPrivat when clicked', () => {
        expect(component).toBeTruthy();
        const optionDe = fixture.debugElement.query(By.css('[data-testid="mka-durchfuehrungsart-privat"]'));

        const titleDe = optionDe.query(By.css('.durchfuehrungsart__option-title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Privat');

        const textDe = optionDe.query(By.css('.durchfuehrungsart__option-text'));
        expect(textDe).toBeTruthy();
        expect(textDe.nativeElement.textContent.trim()).toBe(
            'Ich möchte ein oder mehrere Kinder privat am Wettbewerb teilnehmen lassen.'
        );

        const emitted = vi.fn();
        component.durchfuehrungsartGewaehlt.subscribe(emitted);

        optionDe.triggerEventHandler('click');
        fixture.detectChanges();

        expect(emitted).toHaveBeenCalledOnce();
        expect(emitted).toHaveBeenCalledWith('privat');
    });
});
