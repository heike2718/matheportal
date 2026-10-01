import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchuleDashboardComponent } from './schule-dashboard.component';
import { signal, Signal, WritableSignal } from '@angular/core';
import { SchuleWettbewerbskontext } from '../../../core/model/schule-wettbewerbskontext.model';
import { SchuleFacade } from '../../api/schule.facade';
import { Schule } from '../../../core/model/schulkatalog.model';

describe('SchuleDashboardComponent', () => {
    const schule: Schule = {
        kuerzel: 'S1234567',
        name: 'Baumschule',
        ort: {
            kuerzel: 'O1234567',
            name: 'Waldeck',
            anzahlSchulen: 3,
            land: {
                kuerzel: 'DE-TH',
                name: 'Thüringen',
                anzahlOrte: 354,
            },
        },
    };

    let component: SchuleDashboardComponent;
    let fixture: ComponentFixture<SchuleDashboardComponent>;

    let schuleSignal: WritableSignal<Schule>;
    let schulauswahlMoeglichSignal: WritableSignal<boolean>;
    let wettbewerbskontextLoadedSignal: WritableSignal<boolean>;
    let schulkollegiumLoadedSignal: WritableSignal<boolean>;
    let wettbewerbskontextSignal: WritableSignal<SchuleWettbewerbskontext | undefined>;

    let facadeMock: {
        schule: Signal<Schule>;
        schulauswahlMoeglich: Signal<boolean>;
        wettbewerbskontextLoaded: Signal<boolean>;
        schulkollegiumLoaded: Signal<boolean>;
        wettbewerbskontext: Signal<SchuleWettbewerbskontext | undefined>;
    };

    beforeEach(async () => {
        schuleSignal = signal(schule);
        schulauswahlMoeglichSignal = signal(false);
        wettbewerbskontextLoadedSignal = signal(false);
        schulkollegiumLoadedSignal = signal(false);
        wettbewerbskontextSignal = signal(undefined);

        facadeMock = {
            schule: schuleSignal,
            schulauswahlMoeglich: schulauswahlMoeglichSignal,
            wettbewerbskontextLoaded: wettbewerbskontextLoadedSignal,
            schulkollegiumLoaded: schulkollegiumLoadedSignal,
            wettbewerbskontext: wettbewerbskontextSignal,
        };

        await TestBed.configureTestingModule({
            imports: [SchuleDashboardComponent],
            providers: [
                {
                    provide: SchuleFacade,
                    useValue: facadeMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SchuleDashboardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
