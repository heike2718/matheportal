import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchulenListComponent } from './schulen-list.component';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { By } from '@angular/platform-browser';
import { SchuleCardComponent } from '../schule-card-component/schule-card.component';
import { MockComponent, ngMocks } from 'ng-mocks';

describe('SchulenListComponentComponent', () => {
    const ort: Ort = {
        name: 'Ort 1',
        kuerzel: 'O-1',
        land: {
            kuerzel: 'DE-HE',
            name: 'Hessen',
            anzahlOrte: 8,
        },
        anzahlSchulen: 2,
    };

    const schulen: Schule[] = [
        {
            kuerzel: 'S-1',
            name: 'erste Schule',
            ort,
        },
        {
            kuerzel: 'S-2',
            name: 'zweite Schule',
            ort,
        },
    ];

    let component: SchulenListComponent;
    let fixture: ComponentFixture<SchulenListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SchulenListComponent],
        })
            .overrideComponent(SchulenListComponent, {
                remove: { imports: [SchuleCardComponent] },
                add: { imports: [MockComponent(SchuleCardComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(SchulenListComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('nameSelectedOrt', 'Ort 1 (Hessen)');
        fixture.componentRef.setInput('schulen', schulen);
        fixture.componentRef.setInput('schulenLoaded', true);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('schulen loaded', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('schulen', schulen);
            fixture.componentRef.setInput('schulenLoaded', true);

            await fixture.whenStable();

            fixture.detectChanges();
        });

        it('should show an input and the schulen when schulenLoaded', async () => {
            fixture.componentRef.setInput('schulen', schulen);
            fixture.componentRef.setInput('schulenLoaded', true);

            expect(component).toBeTruthy();

            const backButtonDe = fixture.debugElement.query(By.css('.mka-schulen-list__back'));
            expect(backButtonDe).toBeTruthy();

            const titleDe = fixture.debugElement.query(By.css('.mka-schulen-list__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Schulen in Ort 1 (Hessen) suchen');

            const resultCountDe = fixture.debugElement.query(By.css('.mka-schulen-list__result-count'));
            expect(resultCountDe).toBeTruthy();
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 2');

            const schuleCardsDe = getSchuleCards();

            expect(schuleCardsDe).toHaveLength(2);
            expect(ngMocks.input(schuleCardsDe[0], 'schule')).toEqual(schulen[0]);
            expect(ngMocks.input(schuleCardsDe[1], 'schule')).toEqual(schulen[1]);

            const inputDe = fixture.debugElement.query(By.css('.mka-schulen-list__input'));
            expect(inputDe).toBeTruthy();

            // fokus prüfen
            expect(document.activeElement).toBe(inputDe.nativeElement);
        });

        it('should filter schulen by name', async () => {
            const searchTerm = 'st';
            await enterSearchTerm(searchTerm);

            const schuleCardsDe = getSchuleCards();

            expect(schuleCardsDe).toHaveLength(1);
            expect(ngMocks.input(schuleCardsDe[0], 'schule')).toEqual(schulen[0]);

            const resultCountDe = fixture.debugElement.query(By.css('.mka-schulen-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 1');
        });

        it('should filter schools case-insensitively', async () => {
            await enterSearchTerm('ZWEITE');

            const schuleCardsDe = getSchuleCards();

            expect(schuleCardsDe).toHaveLength(1);
            expect(ngMocks.input(schuleCardsDe[0], 'schule')).toEqual(schulen[1]);

            const resultCountDe = fixture.debugElement.query(By.css('.mka-schulen-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 1');
        });

        it('should show all schools again when the filter is cleared', async () => {
            await enterSearchTerm('erste');
            expect(getSchuleCards()).toHaveLength(1);

            const resultCountDe = fixture.debugElement.query(By.css('.mka-schulen-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 1');

            await enterSearchTerm('');
            expect(getSchuleCards()).toHaveLength(2);

            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 2');
        });

        it('should re-emit schuleSelected when SchuleCardComponent emits schuleSelected', () => {
            const ortSelectedSpy = vi.spyOn(component.schuleSelected, 'emit');

            const ortCardsDe = fixture.debugElement.queryAll(By.directive(SchuleCardComponent));

            expect(ortCardsDe).toHaveLength(2);

            ngMocks.output(ortCardsDe[0], 'schuleSelected').emit(schulen[0]);
            expect(ortSelectedSpy).toHaveBeenCalledExactlyOnceWith(schulen[0]);
        });
    });

    describe('schulen not loaded', () => {
        it('should not show an input and but show a loading info when schulen not loaded', async () => {
            fixture.componentRef.setInput('nameSelectedOrt', undefined);
            fixture.componentRef.setInput('schulen', []);
            fixture.componentRef.setInput('schulenLoaded', false);

            fixture.detectChanges();
            await fixture.whenStable();

            const inputDe = fixture.debugElement.query(By.css('.mka-schulen-list__input'));
            expect(inputDe).toBeFalsy();

            const resultCountDe = fixture.debugElement.query(By.css('.mka-schulen-list__result-count'));
            expect(resultCountDe).toBeTruthy();
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Lade Schulen ...');

            const backButtonDe = fixture.debugElement.query(By.css('.mka-schulen-list__back'));
            expect(backButtonDe).toBeTruthy();

            const titleDe = fixture.debugElement.query(By.css('.mka-schulen-list__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Schulen suchen');

            const schuleCardsDe = getSchuleCards();
            expect(schuleCardsDe).toHaveLength(0);
        });
    });

    function getSchuleCards() {
        return fixture.debugElement.queryAll(By.directive(SchuleCardComponent));
    }

    async function enterSearchTerm(term: string): Promise<void> {
        const input = fixture.debugElement.query(By.css('.mka-schulen-list__input')).nativeElement as HTMLInputElement;

        input.value = term;
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Markiert das Feld als touched und übernimmt den
        // noch ausstehenden debounced Wert sofort.
        input.dispatchEvent(new Event('blur'));

        await fixture.whenStable();
        fixture.detectChanges();
    }
});
