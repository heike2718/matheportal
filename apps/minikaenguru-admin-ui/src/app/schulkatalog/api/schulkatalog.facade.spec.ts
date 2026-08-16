import { Signal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { schulkatalogActions } from '../data/+state/schulkatalog.actions';
import { fromSchulkatalog } from '../data/+state/schulkatalog.selectors';
import { Land, Ort, Schule } from '../model/schulkatalog.model';
import { SchulkatalogFacade } from './schulkatalog.facade';

describe('SchulkatalogFacade', () => {
    let facade: SchulkatalogFacade;

    let storeMock: {
        selectSignal: ReturnType<typeof vi.fn>;
        dispatch: ReturnType<typeof vi.fn>;
    };

    let selectorSignals: Map<unknown, Signal<unknown>>;

    const laender: Land[] = [
        {
            kuerzel: 'LAND-1',
            name: 'erstes Land',
            anzahlOrte: 5,
        },
        {
            kuerzel: 'LAND-2',
            name: 'zweites Land',
            anzahlOrte: 2,
        },
    ];

    const orte: Ort[] = [
        {
            land: laender[0],
            kuerzel: 'ORT-11',
            name: 'erster Ort',
            anzahlSchulen: 10,
        },
        {
            land: laender[0],
            kuerzel: 'ORT-12',
            name: 'zweiter Ort',
            anzahlSchulen: 4,
        },
        {
            land: laender[0],
            kuerzel: 'ORT-13',
            name: 'dritter Ort',
            anzahlSchulen: 24,
        },
    ];

    const schulen: Schule[] = [
        {
            ort: orte[1],
            kuerzel: 'SCHULE-121',
            name: 'erste Schule',
        },
        {
            ort: orte[1],
            kuerzel: 'SCHULE-122',
            name: 'zweite Schule',
        },
        {
            ort: orte[1],
            kuerzel: 'SCHULE-123',
            name: 'dritte Schule',
        },
        {
            ort: orte[1],
            kuerzel: 'SCHULE-124',
            name: 'vierte Schule',
        },
    ];

    const beschreibungSelectedOrt = 'zweiter Ort, erstes Land';

    beforeEach(() => {
        selectorSignals = new Map<unknown, Signal<unknown>>();

        selectorSignals.set(fromSchulkatalog.selectLaender, signal(laender));
        selectorSignals.set(fromSchulkatalog.selectOrte, signal(orte));
        selectorSignals.set(fromSchulkatalog.selectSchulen, signal(schulen));

        selectorSignals.set(fromSchulkatalog.selectLaenderLoadad, signal(true));
        selectorSignals.set(fromSchulkatalog.selectOrteLoaded, signal(true));
        selectorSignals.set(fromSchulkatalog.selectSchulenLoaded, signal(true));

        selectorSignals.set(fromSchulkatalog.selectLandSelected, signal(true));
        selectorSignals.set(fromSchulkatalog.selectOrtSelected, signal(true));
        selectorSignals.set(fromSchulkatalog.selectSchuleSelected, signal(true));

        selectorSignals.set(fromSchulkatalog.selectBeschreibungSelectedOrt, signal(beschreibungSelectedOrt));

        storeMock = {
            selectSignal: vi.fn((selector: unknown) => selectorSignals.get(selector)),
            dispatch: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                SchulkatalogFacade,
                {
                    provide: Store,
                    useValue: storeMock,
                },
            ],
        });

        facade = TestBed.inject(SchulkatalogFacade);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(facade).toBeTruthy();
    });

    describe('selectors', () => {
        it('should expose laender', () => {
            expect(facade.laender()).toEqual(laender);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectLaender);
        });

        it('should expose orte', () => {
            expect(facade.orte()).toEqual(orte);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectOrte);
        });

        it('should expose schulen', () => {
            expect(facade.schulen()).toEqual(schulen);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectSchulen);
        });

        it('should expose isLaenderLoaded', () => {
            expect(facade.isLaenderLoaded()).toBe(true);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectLaenderLoadad);
        });

        it('should expose isOrteLoaded', () => {
            expect(facade.isOrteLoaded()).toBe(true);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectOrteLoaded);
        });

        it('should expose isSchulenLoaded', () => {
            expect(facade.isSchulenLoaded()).toBe(true);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectSchulenLoaded);
        });

        it('should expose isLandSelected', () => {
            expect(facade.isLandSelected()).toBe(true);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectLandSelected);
        });

        it('should expose isOrtSelected', () => {
            expect(facade.isOrtSelected()).toBe(true);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectOrtSelected);
        });

        it('should expose isSchukeSelected', () => {
            expect(facade.isSchukeSelected()).toBe(true);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectSchuleSelected);
        });

        it('should expose beschreibungSelectedOrt', () => {
            expect(facade.beschreibungSelectedOrt()).toBe(beschreibungSelectedOrt);
            expect(storeMock.selectSignal).toHaveBeenCalledWith(fromSchulkatalog.selectBeschreibungSelectedOrt);
        });
    });

    describe('actions', () => {
        it('should dispatch loadLaender when loadLaender is called', () => {
            facade.loadLaender();

            expect(storeMock.dispatch).toHaveBeenCalledWith(schulkatalogActions.loadLaender());
        });

        it('should dispatch landSelected', () => {
            const land = laender[0];

            facade.landSelected(land);

            expect(storeMock.dispatch).toHaveBeenCalledWith(schulkatalogActions.landSelected({ land }));
        });

        it('should dispatch ortSelected', () => {
            const ort = orte[1];

            facade.ortSelected(ort);

            expect(storeMock.dispatch).toHaveBeenCalledWith(schulkatalogActions.ortSelected({ ort }));
        });

        it('should dispatch schuleSelected', () => {
            const schule = schulen[2];

            facade.schuleSelected(schule);

            expect(storeMock.dispatch).toHaveBeenCalledWith(schulkatalogActions.schuleSelected({ schule }));
        });
    });
});
