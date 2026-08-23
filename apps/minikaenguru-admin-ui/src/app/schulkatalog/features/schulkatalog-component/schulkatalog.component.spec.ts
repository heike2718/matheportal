import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchulkatalogComponent } from './schulkatalog.component';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { signal, Signal, WritableSignal } from '@angular/core';
import { SchulkatalogFacade } from '../../api/schulkatalog.facade';
import { LaenderListComponent } from '../laender-list-component/laender-list.component';
import { OrteListComponent } from '../orte-list-component/orte-list.component';
import { SchulenListComponent } from '../schulen-list-component/schulen-list.component';
import { MockComponent, ngMocks } from 'ng-mocks';
import { By } from '@angular/platform-browser';

describe('SchulkatalogComponent', () => {
    const laender: Land[] = [
        {
            kuerzel: 'LAND-1',
            name: 'erstes Land',
            anzahlOrte: 4,
        },
        {
            kuerzel: 'LAND-2',
            name: 'zweies Land',
            anzahlOrte: 2,
        },
    ];

    const orte: Ort[] = [
        {
            land: laender[1],
            kuerzel: 'ORT-21',
            name: 'erster Ort',
            anzahlSchulen: 10,
        },
        {
            land: laender[1],
            kuerzel: 'ORT-22',
            name: 'zweiter Ort',
            anzahlSchulen: 2,
        },
    ];

    const schulen: Schule[] = [
        {
            ort: orte[0],
            kuerzel: 'SCHULE-211',
            name: 'erste Schule',
        },
        {
            ort: orte[0],
            kuerzel: 'SCHULE-212',
            name: 'zweite Schule',
        },
    ];

    let component: SchulkatalogComponent;
    let fixture: ComponentFixture<SchulkatalogComponent>;

    let schulkatalogFacadeMock: {
        laender: Signal<Land[]>;
        isLaenderLoaded: Signal<boolean>;
        selectedLand: Signal<Land | undefined>;
        nameSelectedLand: Signal<string>;
        orte: Signal<Ort[]>;
        isOrteLoaded: Signal<boolean>;
        selectedOrt: Signal<Ort | undefined>;
        beschreibungSelectedOrt: Signal<string>;
        schulen: Signal<Schule[]>;
        isSchulenLoaded: Signal<boolean>;
        selectedSchule: Signal<Schule | undefined>;
        loadLaender: ReturnType<typeof vi.fn>;
        landSelected: ReturnType<typeof vi.fn>;
        backToLaenderRequested: ReturnType<typeof vi.fn>;
        ortSelected: ReturnType<typeof vi.fn>;
        backToOrteRequested: ReturnType<typeof vi.fn>;
        schuleUmbenennenSelected: ReturnType<typeof vi.fn>;
    };

    let laenderSignal: WritableSignal<Land[]>;
    let laenderLoadedSignal: WritableSignal<boolean>;
    let selectedLandSignal: WritableSignal<Land | undefined>;
    let nameSelectedLandSignal: WritableSignal<string>;

    let orteSignal: WritableSignal<Ort[]>;
    let orteLoadedSignal: WritableSignal<boolean>;
    let selectedOrtSignal: WritableSignal<Ort | undefined>;
    let beschreibungSelectedOrtSignal: WritableSignal<string>;

    let schulenSignal: WritableSignal<Schule[]>;
    let schulenLoadedSignal: WritableSignal<boolean>;
    let selectedSchuleSignal: WritableSignal<Schule | undefined>;

    beforeEach(async () => {
        laenderSignal = signal([]);
        laenderLoadedSignal = signal(false);
        selectedLandSignal = signal(undefined);
        nameSelectedLandSignal = signal('');

        orteSignal = signal([]);
        orteLoadedSignal = signal(false);
        selectedOrtSignal = signal(undefined);
        beschreibungSelectedOrtSignal = signal('');

        schulenSignal = signal([]);
        schulenLoadedSignal = signal(false);
        selectedSchuleSignal = signal(undefined);

        schulkatalogFacadeMock = {
            laender: laenderSignal,
            isLaenderLoaded: laenderLoadedSignal,
            selectedLand: selectedLandSignal,
            nameSelectedLand: nameSelectedLandSignal,
            orte: orteSignal,
            isOrteLoaded: orteLoadedSignal,
            selectedOrt: selectedOrtSignal,
            beschreibungSelectedOrt: beschreibungSelectedOrtSignal,
            schulen: schulenSignal,
            isSchulenLoaded: schulenLoadedSignal,
            selectedSchule: selectedSchuleSignal,
            loadLaender: vi.fn(),
            landSelected: vi.fn(),
            backToLaenderRequested: vi.fn(),
            ortSelected: vi.fn(),
            backToOrteRequested: vi.fn(),
            schuleUmbenennenSelected: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [SchulkatalogComponent],
            providers: [{ provide: SchulkatalogFacade, useValue: schulkatalogFacadeMock }],
        })
            .overrideComponent(SchulkatalogComponent, {
                remove: { imports: [LaenderListComponent, OrteListComponent, SchulenListComponent] },
                add: {
                    imports: [
                        MockComponent(LaenderListComponent),
                        MockComponent(OrteListComponent),
                        MockComponent(SchulenListComponent),
                    ],
                },
            })
            .compileComponents();

        vi.resetAllMocks();
        fixture = TestBed.createComponent(SchulkatalogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    describe('initialization', () => {
        it('should call loadLaender on initialize', () => {
            schulenLoadedSignal.set(false);
            schulenSignal.set([]);
            selectedSchuleSignal.set(undefined);
            orteSignal.set([]);
            orteLoadedSignal.set(false);
            beschreibungSelectedOrtSignal.set('');
            selectedOrtSignal.set(undefined);
            laenderLoadedSignal.set(false);
            laenderSignal.set([]);

            fixture.detectChanges();

            expect(schulkatalogFacadeMock.loadLaender).toHaveBeenCalledOnce();
        });
    });

    describe('schulen und orte not loaded', () => {
        beforeEach(() => {
            laenderLoadedSignal.set(true);
            laenderSignal.set(laender);
            selectedLandSignal.set(undefined);
            nameSelectedLandSignal.set('');
            orteLoadedSignal.set(false);
            orteSignal.set([]);
            selectedOrtSignal.set(undefined);
            beschreibungSelectedOrtSignal.set('');
            schulenLoadedSignal.set(false);
            schulenSignal.set([]);
            selectedSchuleSignal.set(undefined);

            fixture.detectChanges();
        });

        it('should not show OrteListComponent and SchulenListComponent', () => {
            const orteListDe = fixture.debugElement.query(By.directive(OrteListComponent));
            expect(orteListDe).toBeFalsy();

            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));
            expect(schulenListDe).toBeFalsy();
        });

        it('should pass data from facade signals down to the LaenderListComponent', () => {
            const laenderListDe = fixture.debugElement.query(By.directive(LaenderListComponent));
            expect(laenderListDe).toBeTruthy();

            expect(ngMocks.input(laenderListDe, 'laender')).toEqual(laender);
            expect(ngMocks.input(laenderListDe, 'laenderLoaded')).toBe(true);
        });

        it('should call landSelected when LaenderListComponent emmits', () => {
            const laenderListDe = fixture.debugElement.query(By.directive(LaenderListComponent));
            ngMocks.output(laenderListDe, 'landSelected').emit(laender[0]);

            expect(schulkatalogFacadeMock.landSelected).toHaveBeenCalledOnce();
            expect(schulkatalogFacadeMock.landSelected).toHaveBeenCalledWith(laender[0]);
        });
    });

    describe('orteLoaded but schulen not', () => {
        beforeEach(() => {
            laenderLoadedSignal.set(true);
            laenderSignal.set(laender);
            selectedLandSignal.set(laender[0]);
            nameSelectedLandSignal.set(laender[0].name);
            orteSignal.set(orte);
            orteLoadedSignal.set(true);
            beschreibungSelectedOrtSignal.set('');
            selectedOrtSignal.set(undefined);
            schulenLoadedSignal.set(false);
            schulenSignal.set([]);
            selectedSchuleSignal.set(undefined);

            fixture.detectChanges();
        });

        it('should not show LaenderListComponent and SchulenListComponent', () => {
            const laenderListDe = fixture.debugElement.query(By.directive(LaenderListComponent));
            expect(laenderListDe).toBeFalsy();

            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));
            expect(schulenListDe).toBeFalsy();
        });

        it('should pass data from facade signals down to the OrteListComponent', () => {
            const orteListDe = fixture.debugElement.query(By.directive(OrteListComponent));
            expect(orteListDe).toBeTruthy();

            expect(ngMocks.input(orteListDe, 'selectedLand')).toBe('erstes Land');
            expect(ngMocks.input(orteListDe, 'orte')).toBe(orte);
            expect(ngMocks.input(orteListDe, 'orteLoaded')).toBe(true);
        });

        it('should trigger facade.backToLaenderRequested when mock emmits backToLaenderRequested', () => {
            const schulenListDe = fixture.debugElement.query(By.directive(OrteListComponent));

            ngMocks.output(schulenListDe, 'backToLaenderRequested').emit();

            expect(schulkatalogFacadeMock.backToLaenderRequested).toHaveBeenCalledOnce();
        });

        it('should trigger facade.ortSelected when mock emmits ortSelected', () => {
            const orteListDe = fixture.debugElement.query(By.directive(OrteListComponent));

            ngMocks.output(orteListDe, 'ortSelected').emit(orte[1]);

            expect(schulkatalogFacadeMock.ortSelected).toHaveBeenCalledOnce();
            expect(schulkatalogFacadeMock.ortSelected).toHaveBeenCalledWith(orte[1]);
        });
    });

    describe('schulen loaded', () => {
        beforeEach(() => {
            laenderLoadedSignal.set(true);
            laenderSignal.set(laender);
            selectedLandSignal.set(laender[0]);
            nameSelectedLandSignal.set(laender[0].name);
            orteSignal.set(orte);
            orteLoadedSignal.set(true);
            selectedOrtSignal.set(orte[1]);
            beschreibungSelectedOrtSignal.set('zweiter Ort (LAND-1)');
            schulenLoadedSignal.set(true);
            schulenSignal.set(schulen);
            selectedSchuleSignal.set(undefined);

            fixture.detectChanges();
        });

        it('should not show LaenderListComponent and OrteListComponent', () => {
            const laenderListDe = fixture.debugElement.query(By.directive(LaenderListComponent));
            expect(laenderListDe).toBeFalsy();

            const orteListComponent = fixture.debugElement.query(By.directive(OrteListComponent));
            expect(orteListComponent).toBeFalsy();
        });

        it('should pass data from facade signals down to the SchulenListComponent', () => {
            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));
            expect(schulenListDe).toBeTruthy();

            expect(ngMocks.input(schulenListDe, 'selectedOrt')).toBe('zweiter Ort (LAND-1)');
            expect(ngMocks.input(schulenListDe, 'schulen')).toBe(schulen);
            expect(ngMocks.input(schulenListDe, 'schulenLoaded')).toBe(true);
        });

        it('should trigger facade.backToOrteRequested when mock emmits backToOrteRequested', () => {
            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));

            ngMocks.output(schulenListDe, 'backToOrteRequested').emit();

            expect(schulkatalogFacadeMock.backToOrteRequested).toHaveBeenCalledOnce();
        });

        it('should trigger facade.schuleUmbenennenSelected when mock emmits schuleUmbenennenSelected', () => {
            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));

            ngMocks.output(schulenListDe, 'schuleUmbenennenSelected').emit(schulen[0]);

            expect(schulkatalogFacadeMock.schuleUmbenennenSelected).toHaveBeenCalledOnce();
            expect(schulkatalogFacadeMock.schuleUmbenennenSelected).toHaveBeenCalledWith(schulen[0]);
        });
    });
});
