import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchuleDashboardComponent } from './schule-dashboard.component';
import { signal, Signal, WritableSignal } from '@angular/core';
import {
    SchuleWettbewerbskontext,
    Schulkollegium,
    TeilnahmeReferenz,
} from '../../../core/model/schule-wettbewerbskontext.model';
import { SchuleFacade } from '../../api/schule.facade';
import { Schule } from '../../../core/model/schulkatalog.model';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../../../core/wettbewerb/model/wettbewerb.model';
import { By } from '@angular/platform-browser';

describe('SchuleDashboardComponent', () => {
    const wettbewerb: Wettbewerb = {
        beginn: '01.01.2026',
        ende: '31.07.2026',
        freischaltungPrivat: '15.06.2026',
        freischaltungSchulen: '14.03.2026',
        jahr: 2029,
        status: WETTBEWERBSSTATUS.anmeldung,
    };

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

    const kollegium: Schulkollegium = {
        kuerzel: 'S1234567',
        kollegium: ['Anna Johanna', 'Hermann Mann'],
    };

    const teilnahmen: TeilnahmeReferenz[] = [
        {
            jahr: 2020,
            teilnahmenummer: 'S1234567',
        },
    ];

    const wettbewerbskontext: SchuleWettbewerbskontext = {
        anmeldungMoeglich: true,
        kollegen: kollegium.kollegium,
        schule,
        teilnahmerefs: teilnahmen,
        vertragDSGVOVorhanden: true,
    };

    let component: SchuleDashboardComponent;
    let fixture: ComponentFixture<SchuleDashboardComponent>;

    let aktuellerWettbewerbSignal: WritableSignal<Wettbewerb>;
    let schulauswahlMoeglichSignal: WritableSignal<boolean>;
    let wettbewerbskontextLoadedSignal: WritableSignal<boolean>;
    let schulkollegiumLoadedSignal: WritableSignal<boolean>;
    let wettbewerbskontextSignal: WritableSignal<SchuleWettbewerbskontext | undefined>;
    let teilnahmenSignal: WritableSignal<TeilnahmeReferenz[]>;

    let facadeMock: {
        aktuellerWettbewerb: Signal<Wettbewerb>;
        schulauswahlMoeglich: Signal<boolean>;
        wettbewerbskontextLoaded: Signal<boolean>;
        schulkollegiumLoaded: Signal<boolean>;
        wettbewerbskontext: Signal<SchuleWettbewerbskontext | undefined>;
    };

    beforeEach(async () => {
        aktuellerWettbewerbSignal = signal(wettbewerb);
        schulauswahlMoeglichSignal = signal(false);
        wettbewerbskontextLoadedSignal = signal(false);
        schulkollegiumLoadedSignal = signal(false);
        wettbewerbskontextSignal = signal(undefined);

        facadeMock = {
            aktuellerWettbewerb: aktuellerWettbewerbSignal,
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

    describe('header tests', () => {
        beforeEach(() => {
            wettbewerbskontextLoadedSignal.set(true);
            wettbewerbskontextSignal.set(wettbewerbskontext);
            fixture.detectChanges();
        });
        it('should show the expected title', () => {
            const titleDe = fixture.debugElement.query(By.css('.schule-dashboard__title'));

            expect(titleDe.nativeElement.textContent.trim()).toBe('Baumschule');
        });
    });
});
