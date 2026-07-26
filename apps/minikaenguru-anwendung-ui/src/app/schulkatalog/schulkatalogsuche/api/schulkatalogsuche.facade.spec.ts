import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SchulkatalogsucheFacade } from './schulkatalogsuche.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { schulkatalogsucheActions } from '../data/+state/schulkatalogsuche.actions';
import { Ort, Schule } from '../model/schulkatalog.model';

describe('SchulkatalosucheFacade tests', () => {
    const ort: Ort = {
        kuerzel: 'ORT-1',
        name: 'erster Ort',
        land: {
            kuerzel: 'DE-BY',
            name: 'Bayern',
        },
        anzahlSchulen: 10,
    };

    let facade: SchulkatalogsucheFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SchulkatalogsucheFacade, provideMockStore({})],
        });
        facade = TestBed.inject(SchulkatalogsucheFacade);
        store = TestBed.inject(Store) as MockStore;

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    it('findSchulen should dispatch the expected action', () => {
        const name = 'Wall';
        facade.findOrte(name);

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(schulkatalogsucheActions.findOrte({ name }));
    });

    it('loadOrte should dispatch the expected action', () => {
        facade.loadSchulen(ort);

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(schulkatalogsucheActions.loadSchulen({ ort }));
    });

    it('ortSelected should dispatch the expected action', () => {
        facade.ortSelected(ort);

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(schulkatalogsucheActions.ortSelected({ ort }));
    });

    it('schuleSelcted should dispatch the expeted action', () => {
        const schule: Schule = {
            ort,
            kuerzel: 'A1234567',
            name: 'Emmi-Noether-Schule',
        };
        facade.schuleSelected(schule);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(schulkatalogsucheActions.schuleSelected({ schule }));
    });
});
