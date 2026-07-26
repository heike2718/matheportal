import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchulkatalogsucheComponent } from './schulkatalogsuche.component';
import { signal, Signal, WritableSignal } from '@angular/core';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { SchulkatalogsucheFacade } from '../../api/schulkatalogsuche.facade';

describe('SchulkatalogsucheComponentComponent', () => {
    let component: SchulkatalogsucheComponent;
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
        }).compileComponents();

        fixture = TestBed.createComponent(SchulkatalogsucheComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
