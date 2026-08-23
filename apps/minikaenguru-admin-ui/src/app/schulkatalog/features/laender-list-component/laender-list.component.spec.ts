import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaenderListComponent } from './laender-list.component';
import { Land } from '../../model/schulkatalog.model';
import { MockComponent, ngMocks } from 'ng-mocks';
import { LandCardComponent } from '../land-card-component/land-card.component';
import { By } from '@angular/platform-browser';

describe('LaenderListComponent', () => {
    const laender: Land[] = [
        {
            kuerzel: 'DE-SN',
            name: 'Sachsen',
            anzahlOrte: 314,
        },
        {
            kuerzel: 'CH',
            name: 'Schweiz',
            anzahlOrte: 26,
        },
    ];

    let component: LaenderListComponent;
    let fixture: ComponentFixture<LaenderListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LaenderListComponent],
        })
            .overrideComponent(LaenderListComponent, {
                remove: { imports: [LandCardComponent] },
                add: { imports: [MockComponent(LandCardComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(LaenderListComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('laenderLoaded', true);
        fixture.componentRef.setInput('laender', laender);

        await fixture.whenStable();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('laender loaded', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('laender', laender);
            fixture.componentRef.setInput('laenderLoaded', true);

            fixture.detectChanges();

            await fixture.whenStable();
        });

        it('should show an input and the laender when laenderLoaded', async () => {
            expect(component).toBeTruthy();

            const titleDe = fixture.debugElement.query(By.css('.mk-admin-laender-list__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Länder');

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-laender-list__result-count'));
            expect(resultCountDe).toBeTruthy();
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 2');

            const landCardsDe = getLandCards();

            expect(landCardsDe).toHaveLength(2);
            expect(ngMocks.input(landCardsDe[0], 'land')).toEqual(laender[0]);
            expect(ngMocks.input(landCardsDe[1], 'land')).toEqual(laender[1]);

            const inputDe = fixture.debugElement.query(By.css('.mk-admin-laender-list__input'));
            expect(inputDe).toBeTruthy();

            // fokus prüfen
            expect(document.activeElement).toBe(inputDe.nativeElement);
        });

        it('should filter laender by name case-insenitively', async () => {
            const searchTerm = 'sa';
            await enterSearchTerm(searchTerm);

            const landCardsDe = getLandCards();

            expect(landCardsDe).toHaveLength(1);
            expect(ngMocks.input(landCardsDe[0], 'land')).toEqual(laender[0]);

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-laender-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 1');
        });

        it('should filter laender case-insensitively starting with term', async () => {
            const searchTerm = 'ei';
            await enterSearchTerm(searchTerm);

            const landCardsDe = getLandCards();

            expect(landCardsDe).toHaveLength(0);

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-laender-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 0');
        });

        it('should show all laender again when filter is cleared', async () => {
            const searchTerm = 'sch';
            await enterSearchTerm(searchTerm);

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-laender-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 1');

            await enterSearchTerm('');
            expect(getLandCards()).toHaveLength(2);

            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl: 2');
        });

        it('should re-emit landSelected when LandCardComponent emits landSelected', () => {
            const ortSelectedSpy = vi.spyOn(component.landSelected, 'emit');

            const landCardsDe = getLandCards();
            expect(landCardsDe).toHaveLength(2);

            ngMocks.output(landCardsDe[1], 'landSelected').emit(laender[1]);
            expect(ortSelectedSpy).toHaveBeenCalledExactlyOnceWith(laender[1]);
        });
    });

    describe('laender not loaded', () => {
        it('should show an input and a waiting info when laender not loaded', async () => {
            fixture.componentRef.setInput('laender', []);
            fixture.componentRef.setInput('laenderLoaded', false);

            fixture.detectChanges();
            await fixture.whenStable();

            const inputDe = fixture.debugElement.query(By.css('.mk-admin-laender-list__input'));
            expect(inputDe).toBeTruthy();

            const resultCountDe = fixture.debugElement.query(By.css('.mk-admin-laender-list__result-count'));
            expect(resultCountDe).toBeTruthy();
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Lade Länder ...');

            // fokus prüfen
            expect(document.activeElement).toBe(inputDe.nativeElement);

            const landCardsDe = getLandCards();
            expect(landCardsDe).toHaveLength(0);
        });
    });

    function getLandCards() {
        return fixture.debugElement.queryAll(By.directive(LandCardComponent));
    }

    async function enterSearchTerm(term: string): Promise<void> {
        const input = fixture.debugElement.query(By.css('.mk-admin-laender-list__input'))
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
