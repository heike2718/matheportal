import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchulenListComponent } from './schulen-list.component';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { MockComponent, ngMocks } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { SchuleCardComponent } from '../schule-card-component/schule-card.component';

describe('SchulenListComponent', () => {
    const land: Land = {
        kuerzel: 'DE-SA',
        name: 'Sachsen-Anhalt',
        anzahlOrte: 367,
    };

    const ort: Ort = {
        land,
        kuerzel: 'F2314G7H',
        name: 'Sangerhausen',
        anzahlSchulen: 10,
    };

    const schulen: Schule[] = [
        {
            ort,
            kuerzel: '5FE42L89',
            name: 'Goetheschule',
        },
        {
            ort,
            kuerzel: 'TF54DE6L',
            name: 'Heinrich-Heine-Schule',
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
            .overrideComponent(SchulenListComponent, {
                remove: { imports: [SchuleCardComponent] },
                add: { imports: [MockComponent(SchuleCardComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(SchulenListComponent);

        component = fixture.componentInstance;

        fixture.componentRef.setInput('selectedOrt', '');
        fixture.componentRef.setInput('schulenLoaded', false);
        fixture.componentRef.setInput('schulen', []);

        await fixture.whenStable();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('schulen loaded', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('selectedOrt', ort.name);
            fixture.componentRef.setInput('schulenLoaded', true);
            fixture.componentRef.setInput('schulen', schulen);

            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should show an input and the schulen when schulen loaded', async () => {
            expect(component).toBeTruthy();

            const titleDe = fixture.debugElement.query(By.css('.mk-admin-schulen-list__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Schulen in Sangerhausen suchen');

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-schulen-list__result-count'));
            expect(resultCountDe).toBeTruthy();
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 2');

            const schuleCardsDe = getSchuleCards();

            expect(schuleCardsDe).toHaveLength(2);
            expect(ngMocks.input(schuleCardsDe[0], 'schule')).toEqual(schulen[0]);
            expect(ngMocks.input(schuleCardsDe[1], 'schule')).toEqual(schulen[1]);

            const inputDe = fixture.debugElement.query(By.css('.mk-admin-schulen-list__input'));
            expect(inputDe).toBeTruthy();

            // fokus prüfen
            expect(document.activeElement).toBe(inputDe.nativeElement);
        });

        it('should filter schulen by name case-insensitively with term in the middle', async () => {
            const searchTerm = 'heine';
            await enterSearchTerm(searchTerm);

            const schuleCardsDe = getSchuleCards();

            expect(schuleCardsDe).toHaveLength(1);
            expect(ngMocks.input(schuleCardsDe[0], 'schule')).toEqual(schulen[1]);

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-schulen-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 1');
        });

        it('should show all schulen again when filter is cleared', async () => {
            const searchTerm = 'heine';
            await enterSearchTerm(searchTerm);

            const schuleCardsDe = getSchuleCards();
            expect(schuleCardsDe).toHaveLength(1);
            expect(ngMocks.input(schuleCardsDe[0], 'schule')).toEqual(schulen[1]);

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-schulen-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 1');

            await enterSearchTerm('');
            expect(getSchuleCards()).toHaveLength(2);

            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 2');
        });

        it('should re-emit schuleSelected when SchuleCardComponent emits schuleSelected', () => {
            const schuleSelectedSpy = vi.spyOn(component.schuleSelected, 'emit');

            const schuleCardsDe = getSchuleCards();
            expect(schuleCardsDe).toHaveLength(2);

            ngMocks.output(schuleCardsDe[1], 'schuleSelected').emit(schulen[1]);
            expect(schuleSelectedSpy).toHaveBeenCalledExactlyOnceWith(schulen[1]);
        });
    });

    describe('schulen not loaded', () => {
        it('should not show an input but a loading message when schulen not loaded', async () => {
            fixture.componentRef.setInput('selectedOrt', ort.name);
            fixture.componentRef.setInput('schulenLoaded', false);
            fixture.componentRef.setInput('schulen', []);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component).toBeTruthy();

            const titleDe = fixture.debugElement.query(By.css('.mk-admin-schulen-list__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Schulen in Sangerhausen suchen');

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-schulen-list__result-count'));
            expect(resultCountDe).toBeTruthy();
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Lade Schulen ...');

            const ortCards = getSchuleCards();
            expect(ortCards).toHaveLength(0);

            const inputDe = fixture.debugElement.query(By.css('.mk-admin-schulen-list__input'));
            expect(inputDe).toBeFalsy();
        });
    });

    function getSchuleCards() {
        return fixture.debugElement.queryAll(By.directive(SchuleCardComponent));
    }

    async function enterSearchTerm(term: string): Promise<void> {
        const input = fixture.debugElement.query(By.css('.mk-admin-schulen-list__input'))
            .nativeElement as HTMLInputElement;

        input.value = term;
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Markiert das Feld als touched und übernimmt den
        // noch ausstehenden debounced Wert sofort.
        input.dispatchEvent(new Event('blur'));

        await fixture.whenStable();
        fixture.detectChanges();
    }
});
