import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchulkatalogComponent } from './schulkatalog.component';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { signal, Signal, WritableSignal } from '@angular/core';
import { SchulkatalogFacade } from '../../api/schulkatalog.facade';
import { LaenderListComponent } from '../laender-list-component/laender-list.component';
import { OrteListComponent } from '../orte-list-component/orte-list.component';
import { SchulenListComponent } from '../schulen-list-component/schulen-list.component';
import { MockComponent } from 'ng-mocks';

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

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
