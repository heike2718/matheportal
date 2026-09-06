import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchulkatalogsucheComponent } from './schulkatalogsuche.component';
import { signal, Signal, WritableSignal } from '@angular/core';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { SchulkatalogsucheFacade } from '../../api/schulkatalogsuche.facade';
import { MockComponent, ngMocks } from 'ng-mocks';
import { OrteSuchenComponent } from '../orte-suchen-component/orte-suchen.component';
import { By } from '@angular/platform-browser';
import { SchulenListComponent } from '../schulen-list-component/schulen-list.component';

describe('SchulkatalogsucheComponentComponent', () => {
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

    const schulen: Schule[] = [
        {
            kuerzel: 'S-1',
            name: 'erste Schule',
            ort: orte[1],
        },
        {
            kuerzel: 'S-2',
            name: 'zweite Schule',
            ort: orte[1],
        },
    ];

    let fixture: ComponentFixture<SchulkatalogsucheComponent>;

    let schulkatalogFacadeMock: {
        orte: Signal<Ort[]>;
        schulen: Signal<Schule[]>;
        selectedOrt: Signal<Ort | undefined>;
        nameSelectedOrt: Signal<string>;
        selectedSchule: Signal<Schule | undefined>;
        isOrteLoaded: Signal<boolean>;
        isSchulenLoaded: Signal<boolean>;
        findOrte: ReturnType<typeof vi.fn>;
        ortSelected: ReturnType<typeof vi.fn>;
        loadSchulen: ReturnType<typeof vi.fn>;
        schuleSelected: ReturnType<typeof vi.fn>;
        ortssucheRequested: ReturnType<typeof vi.fn>;
    };

    let orteSignal: WritableSignal<Ort[]>;
    let isOrteLoadedSignal: WritableSignal<boolean>;
    let selectedOrtSignal: WritableSignal<Ort | undefined>;
    let nameSelectedOrtSignal: WritableSignal<string>;
    let schulenSignal: WritableSignal<Schule[]>;
    let isSchulenLoadedSignal: WritableSignal<boolean>;
    let selectedSchuleSignal: WritableSignal<Schule | undefined>;

    beforeEach(async () => {
        orteSignal = signal([]);
        isOrteLoadedSignal = signal(false);
        selectedOrtSignal = signal(undefined);
        nameSelectedOrtSignal = signal('');

        schulenSignal = signal([]);
        isSchulenLoadedSignal = signal(false);
        selectedSchuleSignal = signal(undefined);

        schulkatalogFacadeMock = {
            orte: orteSignal,
            isOrteLoaded: isOrteLoadedSignal,
            selectedOrt: selectedOrtSignal,
            nameSelectedOrt: nameSelectedOrtSignal,
            schulen: schulenSignal,
            isSchulenLoaded: isSchulenLoadedSignal,
            selectedSchule: selectedSchuleSignal,
            findOrte: vi.fn(),
            ortSelected: vi.fn(),
            loadSchulen: vi.fn(),
            schuleSelected: vi.fn(),
            ortssucheRequested: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [SchulkatalogsucheComponent],
            providers: [
                {
                    provide: SchulkatalogsucheFacade,
                    useValue: schulkatalogFacadeMock,
                },
            ],
        })
            .overrideComponent(SchulkatalogsucheComponent, {
                remove: { imports: [OrteSuchenComponent, SchulenListComponent] },
                add: { imports: [MockComponent(OrteSuchenComponent), MockComponent(SchulenListComponent)] },
            })
            .compileComponents();

        vi.resetAllMocks();
        fixture = TestBed.createComponent(SchulkatalogsucheComponent);
        await fixture.whenStable();
    });

    describe('test schulen not loaded', () => {
        beforeEach(() => {
            orteSignal.set(orte);
            isOrteLoadedSignal.set(true);
            isSchulenLoadedSignal.set(false);
        });

        it('should show the OrteSuchenComponent, but not the SchulenListComponent', () => {
            // Act: UI updaten lassen
            fixture.detectChanges();

            const orteSuchenDe = fixture.debugElement.query(By.directive(OrteSuchenComponent));
            expect(orteSuchenDe).toBeTruthy();
            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));
            expect(schulenListDe).toBeFalsy();
        });

        it('should pass data from facade signals down to mocked OrteSuchenComponent inputs', () => {
            // Act: UI updaten lassen
            fixture.detectChanges();

            const orteSuchenDe = fixture.debugElement.query(By.directive(OrteSuchenComponent));

            expect(ngMocks.input(orteSuchenDe, 'orte')).toEqual(orte);
            expect(ngMocks.input(orteSuchenDe, 'orteLoaded')).toBe(true);
        });

        it('should trigger facade.findOrte immediately when mock emits search term', () => {
            // arrange
            fixture.detectChanges();

            const orteSuchenDe = fixture.debugElement.query(By.directive(OrteSuchenComponent));

            // act
            ngMocks.output(orteSuchenDe, 'searchTermOrtChanged').emit('Wiesbaden');

            // assert
            expect(schulkatalogFacadeMock.findOrte).toHaveBeenCalledOnce();
            expect(schulkatalogFacadeMock.findOrte).toHaveBeenCalledWith('Wiesbaden');
        });

        it('should trigger facade.ortSelected when mock emits ortSelected', () => {
            fixture.detectChanges();
            const orteSuchenDe = fixture.debugElement.query(By.directive(OrteSuchenComponent));

            // Analog für das zweite Output-Event
            ngMocks.output(orteSuchenDe, 'ortSelected').emit(orte[0]);

            expect(schulkatalogFacadeMock.ortSelected).toHaveBeenCalledOnce();
            expect(schulkatalogFacadeMock.ortSelected).toHaveBeenCalledWith(orte[0]);
        });
    });
    describe('test schulen loaded', () => {
        beforeEach(() => {
            selectedOrtSignal.set(orte[1]);
            nameSelectedOrtSignal.set('zweiter Ort (Hessen)');
            isSchulenLoadedSignal.set(true);
        });
        it('should show the SchulenListComponent, but not the OrteSuchenComponent', () => {
            // Arrange: Testdaten in die Facade-Signale schieben
            orteSignal.set(orte);
            isOrteLoadedSignal.set(true);

            // Act: UI updaten lassen
            fixture.detectChanges();

            const orteSuchenDe = fixture.debugElement.query(By.directive(OrteSuchenComponent));
            expect(orteSuchenDe).toBeFalsy();
            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));
            expect(schulenListDe).toBeTruthy();
        });
        it('should pass data from facade signals down to mocked SchulenListComponent inputs', () => {
            nameSelectedOrtSignal.set('zweiter Ort (Hessen)');
            schulenSignal.set(schulen);

            // Act: UI updaten lassen
            fixture.detectChanges();

            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));

            expect(ngMocks.input(schulenListDe, 'schulen')).toEqual(schulen);
            expect(ngMocks.input(schulenListDe, 'nameSelectedOrt')).toBe('zweiter Ort (Hessen)');
            expect(ngMocks.input(schulenListDe, 'schulenLoaded')).toBe(true);
        });
        it('should trigger facade.schuleSelected when mock emits schuleSelected', () => {
            fixture.detectChanges();
            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));

            // Analog für das zweite Output-Event
            ngMocks.output(schulenListDe, 'schuleSelected').emit(schulen[0]);

            expect(schulkatalogFacadeMock.schuleSelected).toHaveBeenCalledOnce();
            expect(schulkatalogFacadeMock.schuleSelected).toHaveBeenCalledWith(schulen[0]);
        });
        it('should trigger facade.ortssucheRequested when mock emits ortssucheRequested', () => {
            schulenSignal.set(schulen);
            isSchulenLoadedSignal.set(true);

            fixture.detectChanges();

            const schulenListDe = fixture.debugElement.query(By.directive(SchulenListComponent));
            expect(schulenListDe);

            ngMocks.output(schulenListDe, 'ortssucheRequested').emit();

            expect(schulkatalogFacadeMock.ortssucheRequested).toHaveBeenCalledOnce();
        });
    });
});
