import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrteSuchenComponent } from './orte-suchen.component';
import { Ort } from '../../model/schulkatalog.model';
import { By } from '@angular/platform-browser';

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
            },
            anzahlSchulen: 10,
        },
        {
            kuerzel: 'ORT-2',
            name: 'zweiter Ort',
            land: {
                kuerzel: 'DE-HE',
                name: 'Hessen',
            },
            anzahlSchulen: 5,
        },
    ];

    let emitSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrteSuchenComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OrteSuchenComponent);
        component = fixture.componentInstance;

        // WICHTIG: Setze alle required Inputs VOR dem ersten detectChanges()
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

            await vi.advanceTimersByTimeAsync(300);
            fixture.detectChanges();

            expect(emitSpy).not.toHaveBeenCalled();
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
    });

    describe('orte tests', () => {
        it('should NOT show orte when orte NOT loaded', () => {
            fixture.componentRef.setInput('orte', orte);
            fixture.componentRef.setInput('orteLoaded', false);

            fixture.detectChanges();

            const anzahlOrteDe = fixture.debugElement.query(By.css('.mka-orte-suchen__result-count'));
            expect(anzahlOrteDe).toBeFalsy();

            const orteTrefferDe = fixture.debugElement.query(By.css('.mka-orte-suchen__results'));
            expect(orteTrefferDe).toBeFalsy();
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

            const cardsDe = fixture.debugElement.queryAll(By.css('mka-ort-card'));
            expect(cardsDe.length).toBe(2);
        });
    });
});
