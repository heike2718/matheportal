import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPrivatpersonComponent } from './dashboard-privatperson.component';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../../../core/wettbewerb/model/wettbewerb.model';
import { ANMELDESTATUS, TeilnahmeReferenz } from '../../../core/model/wettbewerbskontext.model';
import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { signal, Signal, WritableSignal } from '@angular/core';
import { PrivatpersonFacade } from '../../api/privatperson.facade';
import { By } from '@angular/platform-browser';
import { WettbewerbFacade } from '../../../core/wettbewerb/api/wettbewerb.facade';

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
        anmeldestatus: ANMELDESTATUS.nochNichtMoeglich,
        teilnahmerefs: teilnahmen,
    };

    let component: DashboardPrivatpersonComponent;
    let fixture: ComponentFixture<DashboardPrivatpersonComponent>;

    let aktuellerWettbewerbSignal: WritableSignal<Wettbewerb>;
    let wettbewerbskontextLoadedSignal: WritableSignal<boolean>;
    let wettbewerbskontextSignal: WritableSignal<PrivatpersonWettbewerbskontext | undefined>;

    let wettbewerbFacadeMock: {
        aktuellerWettbewerb: Signal<Wettbewerb>;
    };

    let facadeMock: {
        privatteilnahmeAnmelden: ReturnType<typeof vi.fn>;
        wettbewerbOrganisieren: ReturnType<typeof vi.fn>;
        wettbewerbskontextLoaded: Signal<boolean>;
        wettbewerbskontext: Signal<PrivatpersonWettbewerbskontext | undefined>;
    };

    beforeEach(async () => {
        aktuellerWettbewerbSignal = signal(wettbewerb);
        wettbewerbskontextLoadedSignal = signal(false);
        wettbewerbskontextSignal = signal(undefined);

        wettbewerbFacadeMock = {
            aktuellerWettbewerb: aktuellerWettbewerbSignal,
        };

        facadeMock = {
            privatteilnahmeAnmelden: vi.fn(),
            wettbewerbOrganisieren: vi.fn(),
            wettbewerbskontextLoaded: wettbewerbskontextLoadedSignal,
            wettbewerbskontext: wettbewerbskontextSignal,
        };

        await TestBed.configureTestingModule({
            imports: [DashboardPrivatpersonComponent],
            providers: [
                {
                    provide: WettbewerbFacade,
                    useValue: wettbewerbFacadeMock,
                },
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

    describe('aktueller Wettbewerb tests', () => {
        beforeEach(() => {
            wettbewerbskontextLoadedSignal.set(true);
            wettbewerbskontextSignal.set(wettbewerbskontext);
            fixture.detectChanges();
        });
        it('should show the title and the subtitle', () => {
            const titleDe = fixture.debugElement.query(By.css('[data-testid="aktueller-wettbewerb-title"]'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Aktueller Wettbewerb');

            const subtitleDe = fixture.debugElement.query(By.css('[data-testid="aktueller-wettbewerb-subtitle"]'));
            expect(subtitleDe.nativeElement.textContent.trim()).toBe('Minikänguru 2026');
        });
        it('should show anmeldungsbeginn when anmeldung noch nicht möglich', () => {
            const aktuellerWettbewerbskontext: PrivatpersonWettbewerbskontext = {
                ...wettbewerbskontext,
                anmeldestatus: ANMELDESTATUS.nochNichtMoeglich,
            };
            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();
            const titleDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-header"]'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Anmeldung noch nicht möglich');
            const descriptionDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-description"]'));
            expect(descriptionDe.nativeElement.textContent.trim()).toBe('Die Anmeldung ist ab 01.01.2026 möglich.');
            const buttonDe = fixture.debugElement.query(By.css('[data-testid="privatteilnahme-anmelden-btn"]'));
            expect(buttonDe).toBeFalsy();

            const sectionAnmeldungNichtMehrMoeglichDe = fixture.debugElement.query(
                By.css('[data-testid="section-anmeldung-nicht-mehr-moeglich"]')
            );
            expect(sectionAnmeldungNichtMehrMoeglichDe).toBeFalsy();

            const sectionBereitsAngemeldetDe = fixture.debugElement.query(
                By.css('[data-testid="section-bereits-angemeldet"]')
            );
            expect(sectionBereitsAngemeldetDe).toBeFalsy();

            const sectionAnmeldungMoeglichDe = fixture.debugElement.query(By.css('[data-testid="section-moeglich"]'));
            expect(sectionAnmeldungMoeglichDe).toBeFalsy();
        });
        it('should show that beendet when anmeldung nicht mehr möglich', () => {
            const theWettbewerb: Wettbewerb = { ...wettbewerb, status: WETTBEWERBSSTATUS.beendet };
            const aktuellerWettbewerbskontext: PrivatpersonWettbewerbskontext = {
                ...wettbewerbskontext,
                anmeldestatus: ANMELDESTATUS.nichtMehrMoeglich,
            };
            aktuellerWettbewerbSignal.set(theWettbewerb);
            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();

            const titleDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-header"]'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Anmeldung nicht mehr möglich');

            const descriptionDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-description"]'));
            expect(descriptionDe.nativeElement.textContent.trim()).toBe('Der Wettbewerb 2026 ist beendet.');

            const sectionAnmeldungNochNichtMoeglichDe = fixture.debugElement.query(
                By.css('[data-testid="section-anmeldung-noch-nicht-moeglich"]')
            );
            expect(sectionAnmeldungNochNichtMoeglichDe).toBeFalsy();

            const sectionBereitsAngemeldetDe = fixture.debugElement.query(
                By.css('[data-testid="section-bereits-angemeldet"]')
            );
            expect(sectionBereitsAngemeldetDe).toBeFalsy();

            const sectionAnmeldungMoeglichDe = fixture.debugElement.query(By.css('[data-testid="section-moeglich"]'));
            expect(sectionAnmeldungMoeglichDe).toBeFalsy();
        });
        it('should show privatteilnahme anmelden when anmelden möglich', () => {
            const aktuellerWettbewerbskontext: PrivatpersonWettbewerbskontext = {
                ...wettbewerbskontext,
                anmeldestatus: ANMELDESTATUS.moeglich,
            };
            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();

            const titleDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-header"]'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('noch nicht angemeldet');

            const descriptionDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-description"]'));
            expect(descriptionDe.nativeElement.textContent.trim()).toBe(
                'Sie können sich jetzt zum Wettbewerb 2026 anmelden.'
            );

            const buttonDe = fixture.debugElement.query(By.css('[data-testid="privatteilnahme-anmelden-btn"]'));
            expect(buttonDe).toBeTruthy();
            expect(buttonDe.nativeElement.textContent.trim()).toBe('Privatteilnahme anmelden');

            const sectionAnmeldungNochNichtMoeglichDe = fixture.debugElement.query(
                By.css('[data-testid="section-anmeldung-noch-nicht-moeglich"]')
            );
            expect(sectionAnmeldungNochNichtMoeglichDe).toBeFalsy();

            const sectionAnmeldungNichtMehrMoeglichDe = fixture.debugElement.query(
                By.css('[data-testid="section-anmeldung-nicht-mehr-moeglich"]')
            );
            expect(sectionAnmeldungNichtMehrMoeglichDe).toBeFalsy();

            const sectionBereitsAngemeldetDe = fixture.debugElement.query(
                By.css('[data-testid="section-bereits-angemeldet"]')
            );
            expect(sectionBereitsAngemeldetDe).toBeFalsy();
        });
        it('should show Wettbewerb organisieren when bereits angemeldet', () => {
            const aktuellerWettbewerbskontext: PrivatpersonWettbewerbskontext = {
                ...wettbewerbskontext,
                anmeldestatus: ANMELDESTATUS.bereitsAngemeldet,
            };
            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();

            const organisierenHeaderDe = fixture.debugElement.query(
                By.css('[data-testid="wettbewerb-organisieren-header"]')
            );
            expect(organisierenHeaderDe.nativeElement.textContent.trim()).toBe('Wettbewerb organisieren');

            const organisierenDescriptionDe = fixture.debugElement.query(
                By.css('[data-testid="wettbewerb-organisieren-description"]')
            );
            expect(organisierenDescriptionDe.nativeElement.textContent.trim()).toBe(
                'Kinder und Lösungszettel für den Wettbewerb 2026 erfassen und Urkunden ausdrucken'
            );

            const organisierenButtonDe = fixture.debugElement.query(
                By.css('[data-testid="wettbewerb-organisieren-btn"]')
            );
            expect(organisierenButtonDe.nativeElement.textContent.trim()).toBe('Wettbewerb organisieren');

            const sectionAnmeldungNochNichtMoeglichDe = fixture.debugElement.query(
                By.css('[data-testid="section-anmeldung-noch-nicht-moeglich"]')
            );
            expect(sectionAnmeldungNochNichtMoeglichDe).toBeFalsy();

            const sectionAnmeldungNichtMehrMoeglichDe = fixture.debugElement.query(
                By.css('[data-testid="section-anmeldung-nicht-mehr-moeglich"]')
            );
            expect(sectionAnmeldungNichtMehrMoeglichDe).toBeFalsy();

            const sectionAnmeldungMoeglichDe = fixture.debugElement.query(
                By.css('[data-testid="section-anmeldung-moeglich"]')
            );
            expect(sectionAnmeldungMoeglichDe).toBeFalsy();
        });
    });

    describe('fruehere Teilnahmen', () => {
        beforeEach(() => {
            wettbewerbskontextLoadedSignal.set(true);
            wettbewerbskontextSignal.set(wettbewerbskontext);
            fixture.detectChanges();
        });

        it('should show the expected title and text when there are no teilnahmen', () => {
            wettbewerbskontextSignal.set({ ...wettbewerbskontext, teilnahmerefs: [] });
            fixture.detectChanges();

            const cardTitleDe = fixture.debugElement.query(By.css('[data-testid="teilnahmen-title"]'));
            expect(cardTitleDe.nativeElement.textContent.trim()).toBe('Frühere Teilnahmen');

            const teilnahmenDescriptionDe = fixture.debugElement.query(
                By.css('[data-testid="teilnahmen-description"]')
            );
            expect(teilnahmenDescriptionDe.nativeElement.textContent.trim()).toBe(
                'Es liegen noch keine früheren Teilnahmen vor.'
            );
        });

        it('should show the teilnahmen and download button', () => {
            const theTeilnahmen: TeilnahmeReferenz[] = [
                ...teilnahmen,
                {
                    jahr: 2026,
                    teilnahmenummer: 'P123456789',
                },
                {
                    jahr: 2019,
                    teilnahmenummer: 'P123456789',
                },
            ];
            wettbewerbskontextSignal.set({ ...wettbewerbskontext, teilnahmerefs: theTeilnahmen });
            fixture.detectChanges();

            const teilnahmenDivDe = fixture.debugElement.query(By.css('.privatperson-dashboard__participations'));
            expect(teilnahmenDivDe).toBeTruthy();

            const teilnahmeRefDes = fixture.debugElement.queryAll(By.css('.privatperson-dashboard__year'));
            expect(teilnahmeRefDes.length).toBe(2);
            expect(teilnahmeRefDes[0].nativeElement.textContent.trim()).toBe('2020');
            expect(teilnahmeRefDes[1].nativeElement.textContent.trim()).toBe('2019');

            const downloadBtnDe = fixture.debugElement.queryAll(By.css('[data-testid="download-teilnahme-btn"]'));
            expect(downloadBtnDe.length).toBe(2);
            expect(downloadBtnDe[0].nativeElement.textContent.trim()).toContain('Statistik');
        });
    });
});
