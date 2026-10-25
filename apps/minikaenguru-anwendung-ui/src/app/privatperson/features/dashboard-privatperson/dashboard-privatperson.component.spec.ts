import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPrivatpersonComponent } from './dashboard-privatperson.component';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../../../core/wettbewerb/model/wettbewerb.model';
import { TeilnahmeReferenz } from '../../../core/model/schule-wettbewerbskontext.model';
import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { signal, Signal, WritableSignal } from '@angular/core';
import { PrivatpersonFacade } from '../../api/privatperson.facade';

describe('DashboardPrivatComponent', () => {
    const wettbewerb: Wettbewerb = {
        beginn: '01.01.2026',
        ende: '31.07.2026',
        freischaltungPrivat: '15.06.2026',
        freischaltungSchulen: '14.03.2026',
        jahr: 2026,
        status: WETTBEWERBSSTATUS.anmeldung,
    };

    const teilnahmen: TeilnahmeReferenz[] = [
        {
            jahr: 2020,
            teilnahmenummer: 'S1234567',
        },
    ];

    const wettbewerbskontext: PrivatpersonWettbewerbskontext = {
        anmeldungMoeglich: true,
        teilnahmerefs: teilnahmen,
    };

    let component: DashboardPrivatpersonComponent;
    let fixture: ComponentFixture<DashboardPrivatpersonComponent>;

    let aktuellerWettbewerbSignal: WritableSignal<Wettbewerb>;
    let wettbewerbskontextLoadedSignal: WritableSignal<boolean>;
    let wettbewerbskontextSignal: WritableSignal<PrivatpersonWettbewerbskontext | undefined>;

    let facadeMock: {
        aktuellerWettbewerb: Signal<Wettbewerb>;
        wettbewerbskontextLoaded: Signal<boolean>;
        wettbewerbskontext: Signal<PrivatpersonWettbewerbskontext | undefined>;
    };

    beforeEach(async () => {
        aktuellerWettbewerbSignal = signal(wettbewerb);
        wettbewerbskontextLoadedSignal = signal(false);
        wettbewerbskontextSignal = signal(undefined);

        facadeMock = {
            aktuellerWettbewerb: aktuellerWettbewerbSignal,
            wettbewerbskontextLoaded: wettbewerbskontextLoadedSignal,
            wettbewerbskontext: wettbewerbskontextSignal,
        };

        await TestBed.configureTestingModule({
            imports: [DashboardPrivatpersonComponent],
            providers: [
                {
                    provide: PrivatpersonFacade,
                    useValue: facadeMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardPrivatpersonComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
