import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrteListComponent } from './orte-list.component';
import { Land, Ort } from '../../model/schulkatalog.model';
import { OrtCardComponent } from '../ort-card-component/ort-card.component';
import { MockComponent, ngMocks } from 'ng-mocks';
import { By } from '@angular/platform-browser';

describe('OrteListComponent', () => {
    const land: Land = {
        kuerzel: 'CH',
        name: 'Schweiz',
        anzahlOrte: 20,
    };

    const orte: Ort[] = [
        {
            land,
            kuerzel: 'ORT-1',
            name: 'Zürich',
            anzahlSchulen: 3,
        },
        {
            land,
            kuerzel: 'ORT-2',
            name: 'Winterthur',
            anzahlSchulen: 1,
        },
    ];

    let component: OrteListComponent;
    let fixture: ComponentFixture<OrteListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrteListComponent],
        })
            .overrideComponent(OrteListComponent, {
                remove: { imports: [OrtCardComponent] },
                add: { imports: [MockComponent(OrtCardComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(OrteListComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('selectedLand', '');
        fixture.componentRef.setInput('orteLoaded', false);
        fixture.componentRef.setInput('orte', []);

        await fixture.whenStable();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('orte loaded', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('selectedLand', land.name);
            fixture.componentRef.setInput('orteLoaded', true);
            fixture.componentRef.setInput('orte', orte);

            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should show an input and the orte when orte loaded', async () => {
            expect(component).toBeTruthy();

            const titleDe = fixture.debugElement.query(By.css('.mk-admin-orte-list__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Orte in Schweiz suchen');

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-orte-list__result-count'));
            expect(resultCountDe).toBeTruthy();
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 2');

            const ortCards = getOrtCards();

            expect(ortCards).toHaveLength(2);
            expect(ngMocks.input(ortCards[0], 'ort')).toEqual(orte[0]);
            expect(ngMocks.input(ortCards[1], 'ort')).toEqual(orte[1]);

            const inputDe = fixture.debugElement.query(By.css('.mk-admin-orte-list__input'));
            expect(inputDe).toBeTruthy();

            // fokus prüfen
            expect(document.activeElement).toBe(inputDe.nativeElement);
        });

        it('should filter orte by name case-insensitively starting with term', async () => {
            const searchTerm = 'zü';
            await enterSearchTerm(searchTerm);

            const ortCardsDe = getOrtCards();

            expect(ortCardsDe).toHaveLength(1);
            expect(ngMocks.input(ortCardsDe[0], 'ort')).toEqual(orte[0]);

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-orte-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 1');
        });

        it('should filter orte by name starting with term', async () => {
            const searchTerm = 'thur';
            await enterSearchTerm(searchTerm);

            const landCardsDe = getOrtCards();

            expect(landCardsDe).toHaveLength(0);

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-orte-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 0');
        });

        it('should show all orte again when filter is cleared', async () => {
            const searchTerm = 'zü';
            await enterSearchTerm(searchTerm);

            const ortCardsDe = getOrtCards();
            expect(ortCardsDe).toHaveLength(1);
            expect(ngMocks.input(ortCardsDe[0], 'ort')).toEqual(orte[0]);

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-orte-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 1');

            await enterSearchTerm('');
            expect(getOrtCards()).toHaveLength(2);

            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 2');
        });
    });

    describe('orte not loaded', () => {
        it('should not show an input but a loading message when orte not loaded', async () => {
            fixture.componentRef.setInput('selectedLand', land.name);
            fixture.componentRef.setInput('orteLoaded', false);
            fixture.componentRef.setInput('orte', []);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component).toBeTruthy();

            const titleDe = fixture.debugElement.query(By.css('.mk-admin-orte-list__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Orte in Schweiz suchen');

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-orte-list__result-count'));
            expect(resultCountDe).toBeTruthy();
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Lade Orte ...');

            const ortCards = getOrtCards();
            expect(ortCards).toHaveLength(0);

            const inputDe = fixture.debugElement.query(By.css('.mk-admin-orte-list__input'));
            expect(inputDe).toBeFalsy();
        });
    });

    function getOrtCards() {
        return fixture.debugElement.queryAll(By.directive(OrtCardComponent));
    }

    async function enterSearchTerm(term: string): Promise<void> {
        const input = fixture.debugElement.query(By.css('.mk-admin-orte-list__input'))
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
