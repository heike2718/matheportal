import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLehrpersonComponent } from './dashboard-lehrperson.component';
import { signal, Signal, WritableSignal } from '@angular/core';
import { Schule } from '../../../core/model/schulkatalog.model';
import { LehrpersonFacade } from '../../api/lehrperson.facade';
import { By } from '@angular/platform-browser';
import { ngMocks } from 'ng-mocks';
import { LehrpersonSchulenComponent } from '../lehrperson-schulen-component/lehrperson-schulen.component';

describe('DashboardLehrpersonComponent', () => {
    let component: DashboardLehrpersonComponent;
    let fixture: ComponentFixture<DashboardLehrpersonComponent>;

    let schulenSignal: WritableSignal<Schule[]>;
    let isSchulenLoadedSignal: WritableSignal<boolean>;

    let facadeMock: {
        isSchulenLoaded: Signal<boolean>;
        schulen: Signal<Schule[]>;
        schuleAusgewaehlt: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        isSchulenLoadedSignal = signal(false);
        schulenSignal = signal([]);

        facadeMock = {
            schulen: schulenSignal,
            isSchulenLoaded: isSchulenLoadedSignal,
            schuleAusgewaehlt: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [DashboardLehrpersonComponent],
            providers: [
                {
                    provide: LehrpersonFacade,
                    useValue: facadeMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardLehrpersonComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();

        const titleDe = fixture.debugElement.query(By.css('.lehrperson-dashboard__title'));
        expect(titleDe).toBeTruthy();
        expect(titleDe.nativeElement.textContent.trim()).toBe('Minikänguru an Ihrer Schule');

        const generalHintDe = fixture.debugElement.query(By.css('[data-testid="lehrperson-dashboard-general-hint"]'));
        expect(generalHintDe).toBeTruthy();
    });

    it('should not show the school selection before schools are loaded', () => {
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.directive(LehrpersonSchulenComponent))).toBeNull();

        expect(fixture.debugElement.query(By.css('.lehrperson-dashboard__schulenlist-header'))).toBeNull();

        expect(fixture.debugElement.query(By.css('[data-testid="lehrperson-dashboard-schulenlist-hint"]'))).toBeNull();

        expect(facadeMock.schuleAusgewaehlt).not.toHaveBeenCalled();
    });

    describe('schulen loaded', () => {
        const schulen: Schule[] = [
            {
                kuerzel: 'S-1',
                name: 'erste Schule',
                ort: {
                    name: 'Ort 1',
                    kuerzel: 'O-1',
                    land: {
                        kuerzel: 'DE-HE',
                        name: 'Hessen',
                        anzahlOrte: 8,
                    },
                    anzahlSchulen: 2,
                },
            },
            {
                kuerzel: 'S-2',
                name: 'zweite Schule',
                ort: {
                    name: 'Ort 2',
                    kuerzel: 'O-2',
                    land: {
                        kuerzel: 'DE-SN',
                        name: 'Sachsen',
                        anzahlOrte: 20,
                    },
                    anzahlSchulen: 5,
                },
            },
        ];

        beforeEach(() => {
            isSchulenLoadedSignal.set(true);
            schulenSignal.set(schulen);

            fixture.detectChanges();
        });
        it('should pass the schools and loading state to LehrpersonSchulenComponent', () => {
            const schulenListDe = fixture.debugElement.query(By.directive(LehrpersonSchulenComponent));

            expect(schulenListDe).toBeTruthy();
            expect(ngMocks.input(schulenListDe, 'schulen')()).toEqual(schulen);
            expect(ngMocks.input(schulenListDe, 'schulenLoaded')()).toBe(true);

            const hintDe = fixture.debugElement.query(By.css('[data-testid="lehrperson-dashboard-schulenlist-hint"]'));

            expect(hintDe).toBeTruthy();
        });

        it('should forward the selected school from the child component to the facade', () => {
            const schulenListDe = fixture.debugElement.query(By.directive(LehrpersonSchulenComponent));

            expect(schulenListDe).toBeTruthy();
            expect(facadeMock.schuleAusgewaehlt).not.toHaveBeenCalled();

            ngMocks.output(schulenListDe, 'schuleSelected').emit(schulen[1]);

            expect(facadeMock.schuleAusgewaehlt).toHaveBeenCalledExactlyOnceWith(schulen[1]);
        });

        it('should hide the school selection when the loading state changes to false', () => {
            expect(fixture.debugElement.query(By.directive(LehrpersonSchulenComponent))).toBeTruthy();

            // Die Schulen bleiben vorhanden. Nur der Ladezustand ändert sich.
            isSchulenLoadedSignal.set(false);
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.directive(LehrpersonSchulenComponent))).toBeNull();

            expect(fixture.debugElement.query(By.css('.lehrperson-dashboard__schulenlist-header'))).toBeNull();

            expect(
                fixture.debugElement.query(By.css('[data-testid="lehrperson-dashboard-schulenlist-hint"]'))
            ).toBeNull();
        });
    });
});
