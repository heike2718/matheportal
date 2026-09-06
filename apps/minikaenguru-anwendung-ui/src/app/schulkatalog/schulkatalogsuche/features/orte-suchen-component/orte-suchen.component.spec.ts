import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrteSuchenComponent } from './orte-suchen.component';
import { Ort } from '../../model/schulkatalog.model';
import { By } from '@angular/platform-browser';
import { OrtCardComponent } from '../ort-card-component/ort-card.component';
import { MockComponent, ngMocks } from 'ng-mocks';

describe('OrteSuchenComponentComponent', () => {
    let component: OrteSuchenComponent;
    let fixture: ComponentFixture<OrteSuchenComponent>;

    const orte: Ort[] = [
        {
            kuerzel: 'ORT-1',
            name: 'erster Ort',
            land: {
                kuerzel: 'DE-BY',
                name: 'Bayern',
                anzahlOrte: 19,
            },
            anzahlSchulen: 10,
        },
        {
            kuerzel: 'ORT-2',
            name: 'zweiter Ort',
            land: {
                kuerzel: 'DE-HE',
                name: 'Hessen',
                anzahlOrte: 8,
            },
            anzahlSchulen: 5,
        },
    ];

    let emitSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrteSuchenComponent],
        })
            .overrideComponent(OrteSuchenComponent, {
                remove: { imports: [OrtCardComponent] },
                add: { imports: [MockComponent(OrtCardComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(OrteSuchenComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('orte', []);
        fixture.componentRef.setInput('orteLoaded', false);

        await fixture.whenStable();

        emitSpy = vi.spyOn(component.searchTermOrtChanged, 'emit');

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    describe('create tests', () => {
        it('should create but not emit when initialized', async () => {
            fixture.detectChanges();
            expect(component).toBeTruthy();

            const titleDe = fixture.debugElement.query(By.css('.mka-orte-suchen__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Ort suchen');

            await vi.advanceTimersByTimeAsync(300);
            fixture.detectChanges();

            expect(emitSpy).not.toHaveBeenCalled();

            const errorDe = fixture.debugElement.query(By.css('.mka-orte-suchen__error'));
            expect(errorDe).toBeFalsy();

            const searchfieldHintDe = fixture.debugElement.query(By.css('.search-field__hint'));
            expect(searchfieldHintDe).toBeFalsy();

            const validationHintDe = fixture.debugElement.query(By.css('.mka-orte-suchen__validation-hint'));
            expect(validationHintDe).toBeFalsy();
        });

        it('should show an input', () => {
            fixture.detectChanges();

            const inputDe = fixture.debugElement.query(By.css('.mka-orte-suchen__input'));
            expect(inputDe).toBeTruthy();

            // fokus prüfen
            expect(document.activeElement).toBe(inputDe.nativeElement);
        });
    });

    describe('emit tests', () => {
        it('should emit searchTermOrtChanged after 300ms debounce when input changes', async () => {
            const inputDe = fixture.debugElement.query(By.css('.mka-orte-suchen__input'));
            const inputEl = inputDe.nativeElement as HTMLInputElement;

            inputEl.value = 'Frankfurt';
            inputEl.dispatchEvent(new Event('input'));

            expect(emitSpy).not.toHaveBeenCalled();

            await vi.advanceTimersByTimeAsync(300);
            fixture.detectChanges();

            expect(emitSpy).toHaveBeenCalledOnce();
            expect(emitSpy).toHaveBeenCalledWith('Frankfurt');
        });

        it('should NOT emit if the trimmed term is the same as previousTerm', async () => {
            const inputDe = fixture.debugElement.query(By.css('.mka-orte-suchen__input'));
            const inputEl = inputDe.nativeElement as HTMLInputElement;

            // Erste Eingabe
            inputEl.value = 'Hamburg';
            inputEl.dispatchEvent(new Event('input'));

            await vi.advanceTimersByTime(300);
            fixture.detectChanges();

            emitSpy.mockClear();

            // Zweite Eingabe: Fügt nur Leerzeichen hinzu
            inputEl.value = 'Hamburg   ';
            inputEl.dispatchEvent(new Event('input'));

            await vi.advanceTimersByTime(300);
            fixture.detectChanges();

            expect(emitSpy).not.toHaveBeenCalled();
        });

        it('should NOT emit if the input is invalid', async () => {
            const inputDe = fixture.debugElement.query(By.css('.mka-orte-suchen__input'));
            const inputEl = inputDe.nativeElement as HTMLInputElement;

            inputEl.value = 'Красноярск';
            inputEl.dispatchEvent(new Event('input'));

            await vi.advanceTimersByTime(300);
            fixture.detectChanges();

            expect(emitSpy).not.toHaveBeenCalled();

            const errorDe = fixture.debugElement.query(By.css('.mka-orte-suchen__error'));
            expect(errorDe).toBeTruthy();
            expect(errorDe.nativeElement.textContent.trim()).toBe('Der Suchbegriff enthält nicht erlaubte Zeichen.');

            const searchfieldHintDe = fixture.debugElement.query(By.css('.search-field__hint'));
            expect(searchfieldHintDe).toBeTruthy();
            expect(searchfieldHintDe.nativeElement.textContent.trim()).toBe('Nicht erlaubt: К, р, а, с, н, о, я, к');

            const validationHintDe = fixture.debugElement.query(By.css('.mka-orte-suchen__validation-hint'));
            expect(validationHintDe).toBeTruthy();
            expect(validationHintDe.nativeElement.textContent.trim()).toBe(
                'Erlaubt sind lateinische Buchstaben, Zahlen, Leerzeichen, Satzzeichen und Symbole.'
            );
        });

        it('should re-emit ortSelected when OrtCardComponent emits ortSelected', () => {
            fixture.componentRef.setInput('orte', orte);
            fixture.componentRef.setInput('orteLoaded', true);
            fixture.detectChanges();

            const ortSelectedSpy = vi.spyOn(component.ortSelected, 'emit');

            const ortCardsDe = fixture.debugElement.queryAll(By.directive(OrtCardComponent));

            expect(ortCardsDe).toHaveLength(2);

            ngMocks.output(ortCardsDe[0], 'ortSelected').emit(orte[0]);

            expect(ortSelectedSpy).toHaveBeenCalledExactlyOnceWith(orte[0]);
        });
    });

    describe('orte tests', () => {
        it('should NOT show orte when orte NOT loaded', () => {
            fixture.componentRef.setInput('orte', orte);
            fixture.componentRef.setInput('orteLoaded', false);

            fixture.detectChanges();

            const anzahlOrteDe = fixture.debugElement.query(By.css('.mka-orte-suchen__result-count'));
            expect(anzahlOrteDe).toBeTruthy();
            expect(anzahlOrteDe.nativeElement.textContent.trim()).toBe('Bitte geben Sie einen Ort ein.');

            const orteTrefferDe = fixture.debugElement.query(By.css('.mka-orte-suchen__results'));
            expect(orteTrefferDe).toBeFalsy();

            const ortCardsDe = fixture.debugElement.queryAll(By.directive(OrtCardComponent));
            expect(ortCardsDe).toHaveLength(0);
        });

        it('should show orte when orte loaded', () => {
            fixture.componentRef.setInput('orte', orte);
            fixture.componentRef.setInput('orteLoaded', true);

            fixture.detectChanges();

            const anzahlOrteDe = fixture.debugElement.query(By.css('.mka-orte-suchen__result-count'));
            expect(anzahlOrteDe).toBeTruthy();
            expect(anzahlOrteDe.nativeElement.textContent.trim()).toBe('Anzahl Orte: 2');

            const orteTrefferDe = fixture.debugElement.query(By.css('.mka-orte-suchen__results'));
            expect(orteTrefferDe).toBeTruthy();

            const ortCardsDe = fixture.debugElement.queryAll(By.directive(OrtCardComponent));
            expect(ortCardsDe).toHaveLength(2);
        });
    });
});
