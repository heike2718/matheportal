import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchulkatalogsucheComponent } from './schulkatalogsuche.component';
import { signal, Signal, WritableSignal } from '@angular/core';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { SchulkatalogsucheFacade } from '../../api/schulkatalogsuche.facade';
import { MockComponent, ngMocks } from 'ng-mocks';
import { OrteSuchenComponent } from '../orte-suchen-component/orte-suchen.component';
import { By } from '@angular/platform-browser';

describe('SchulkatalogsucheComponentComponent', () => {
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

    let fixture: ComponentFixture<SchulkatalogsucheComponent>;

    let schulkatalogFacadeMock: {
        orte: Signal<Ort[]>;
        schulen: Signal<Schule[]>;
        selectedOrt: Signal<Ort | undefined>;
        selectedSchule: Signal<Schule | undefined>;
        isOrteLoaded: Signal<boolean>;
        isSchulenLoaded: Signal<boolean>;
        findOrte: ReturnType<typeof vi.fn>;
        ortSelected: ReturnType<typeof vi.fn>;
        loadSchulen: ReturnType<typeof vi.fn>;
        schuleSelected: ReturnType<typeof vi.fn>;
    };

    let orteSignal: WritableSignal<Ort[]>;
    let isOrteLoadedSignal: WritableSignal<boolean>;
    let selectedOrtSignal: WritableSignal<Ort | undefined>;
    let schulenSignal: WritableSignal<Schule[]>;
    let isSchulenLoadedSignal: WritableSignal<boolean>;
    let selectedSchuleSignal: WritableSignal<Schule | undefined>;

    beforeEach(async () => {
        orteSignal = signal([]);
        isOrteLoadedSignal = signal(false);
        selectedOrtSignal = signal(undefined);

        schulenSignal = signal([]);
        isSchulenLoadedSignal = signal(false);
        selectedSchuleSignal = signal(undefined);

        schulkatalogFacadeMock = {
            orte: orteSignal,
            isOrteLoaded: isOrteLoadedSignal,
            selectedOrt: selectedOrtSignal,
            schulen: schulenSignal,
            isSchulenLoaded: isSchulenLoadedSignal,
            selectedSchule: selectedSchuleSignal,
            findOrte: vi.fn(),
            ortSelected: vi.fn(),
            loadSchulen: vi.fn(),
            schuleSelected: vi.fn(),
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
                remove: { imports: [OrteSuchenComponent] },
                add: { imports: [MockComponent(OrteSuchenComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(SchulkatalogsucheComponent);
        await fixture.whenStable();
    });

    it('should pass data from facade signals down to mocked OrteSuchenComponent inputs', () => {
        // Arrange: Testdaten in die Facade-Signale schieben
        orteSignal.set(orte);
        isOrteLoadedSignal.set(true);

        // Act: UI updaten lassen
        fixture.detectChanges();

        const orteSuchenDe = fixture.debugElement.query(By.directive(OrteSuchenComponent));

        expect(ngMocks.input(orteSuchenDe, 'orte')).toEqual(orte);
        expect(ngMocks.input(orteSuchenDe, 'orteLoaded')).toBe(true);
    });

    it('should trigger facade.findOrte immediately when mock emits search term', () => {
        // arrange
        const orteSuchenDe = fixture.debugElement.query(By.directive(OrteSuchenComponent));

        // act
        ngMocks.output(orteSuchenDe, 'searchTermOrtChanged').emit('Wiesbaden');

        // assert
        expect(schulkatalogFacadeMock.findOrte).toHaveBeenCalledOnce();
        expect(schulkatalogFacadeMock.findOrte).toHaveBeenCalledWith('Wiesbaden');
    });

    it('should trigger facade.ortSelected when mock emits ortSelected', () => {
        const orteSuchenDe = fixture.debugElement.query(By.directive(OrteSuchenComponent));

        // Analog für das zweite Output-Event
        ngMocks.output(orteSuchenDe, 'ortSelected').emit(orte[0]);

        expect(schulkatalogFacadeMock.ortSelected).toHaveBeenCalledOnce();
        expect(schulkatalogFacadeMock.ortSelected).toHaveBeenCalledWith(orte[0]);
    });
});
