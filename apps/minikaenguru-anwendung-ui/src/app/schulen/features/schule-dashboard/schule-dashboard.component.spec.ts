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
        jahr: 2026,
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

    let facadeMock: {
        aktuellerWettbewerb: Signal<Wettbewerb>;
        schulauswahlMoeglich: Signal<boolean>;
        wettbewerbskontextLoaded: Signal<boolean>;
        schulkollegiumLoaded: Signal<boolean>;
        wettbewerbskontext: Signal<SchuleWettbewerbskontext | undefined>;
        schuleWechselnRequested: ReturnType<typeof vi.fn>;
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
            schuleWechselnRequested: vi.fn(),
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

        vi.resetAllMocks();
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
        it('should show the expected location when ort !== land', () => {
            const locationDe = fixture.debugElement.query(By.css('.schule-dashboard__location'));
            expect(locationDe.nativeElement.textContent.trim()).toEqual('Waldeck · Thüringen');
        });
        it('should show the expected location when ort === land', () => {
            const otheSchule: Schule = {
                ...schule,
                ort: {
                    kuerzel: 'T56456789',
                    name: 'Hamburg',
                    anzahlSchulen: 56,
                    land: {
                        kuerzel: 'DE-HH',
                        name: 'Hamburg',
                        anzahlOrte: 1,
                    },
                },
            };
            wettbewerbskontextSignal.set({ ...wettbewerbskontext, schule: otheSchule });
            fixture.detectChanges();
            const locationDe = fixture.debugElement.query(By.css('.schule-dashboard__location'));
            expect(locationDe.nativeElement.textContent.trim()).toEqual('Hamburg');
        });
        it('should not show the schuleWechseln button when schulauswahlMoeglich false', () => {
            const buttonDe = fixture.debugElement.query(By.css('[data-testid="schule-wechseln-btn"]'));
            expect(buttonDe).toBe(null);
        });
        it('should show the schuleWechseln button when schulauswahlMoeglich true', () => {
            schulauswahlMoeglichSignal.set(true);
            fixture.detectChanges();
            const buttonDe = fixture.debugElement.query(By.css('[data-testid="schule-wechseln-btn"]'));
            expect(buttonDe).toBeDefined();

            component.schuleWechseln();
            expect(facadeMock.schuleWechselnRequested).toHaveBeenCalledOnce();
        });
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
        it('should show the aktuelle Teilnahme when already angemeldet', () => {
            const alleTeilnahmen: TeilnahmeReferenz[] = [
                ...teilnahmen,
                {
                    jahr: 2026,
                    teilnahmenummer: 'S1234567',
                },
            ];
            const aktuellerWettbewerbskontext: SchuleWettbewerbskontext = {
                ...wettbewerbskontext,
                anmeldungMoeglich: true,
                teilnahmerefs: alleTeilnahmen,
            };
            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();

            const titleDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-header"]'));
            expect(titleDe.nativeElement.textContent.trim()).toBe(
                'PENDING!!! Hier jetzt die teilnahme-component einhängen'
            );

            const buttonDe = fixture.debugElement.query(By.css('[data-testid="schule-anmelden-btn"]'));
            expect(buttonDe).toBeFalsy();
        });
        it('should show schule anmelden and the button when anmeldungMoeglich and not angemeldet', () => {
            const aktuellerWettbewerbskontext: SchuleWettbewerbskontext = {
                ...wettbewerbskontext,
                anmeldungMoeglich: true,
            };
            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();

            const titleDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-header"]'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Schule noch nicht angemeldet');

            const descriptionDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-description"]'));
            expect(descriptionDe.nativeElement.textContent.trim()).toBe(
                'Die Schule kann jetzt zum Wettbewerb 2026 angemeldet werden.'
            );

            const buttonDe = fixture.debugElement.query(By.css('[data-testid="schule-anmelden-btn"]'));
            expect(buttonDe).toBeTruthy();
            expect(buttonDe.nativeElement.textContent.trim()).toBe('Schule anmelden');
        });
        it('should show anmeldungsbeginn when anmeldungMoeglich false and wettbewerb running', () => {
            const aktuellerWettbewerbskontext: SchuleWettbewerbskontext = {
                ...wettbewerbskontext,
                anmeldungMoeglich: false,
            };
            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();
            const titleDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-header"]'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Anmeldung noch nicht möglich');
            const descriptionDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-description"]'));
            expect(descriptionDe.nativeElement.textContent.trim()).toBe('Die Anmeldung ist ab 01.01.2026 möglich.');
            const buttonDe = fixture.debugElement.query(By.css('[data-testid="schule-anmelden-btn"]'));
            expect(buttonDe).toBeFalsy();
        });
        it('should show that beendet when anmeldungMoeglich false and wettbewerb beendet', () => {
            const theWettbewerb: Wettbewerb = { ...wettbewerb, status: WETTBEWERBSSTATUS.beendet };
            const aktuellerWettbewerbskontext: SchuleWettbewerbskontext = {
                ...wettbewerbskontext,
                anmeldungMoeglich: false,
            };
            aktuellerWettbewerbSignal.set(theWettbewerb);
            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();

            const titleDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-header"]'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Anmeldung nicht mehr möglich');

            const descriptionDe = fixture.debugElement.query(By.css('[data-testid="anmeldung-description"]'));
            expect(descriptionDe.nativeElement.textContent.trim()).toBe('Der Wettbewerb 2026 ist beendet.');

            const buttonDe = fixture.debugElement.query(By.css('[data-testid="schule-anmelden-btn"]'));
            expect(buttonDe).toBeFalsy();
        });
    });

    describe('schule-card', () => {
        beforeEach(() => {
            schulkollegiumLoadedSignal.set(true);
            wettbewerbskontextLoadedSignal.set(true);
            wettbewerbskontextSignal.set(wettbewerbskontext);
            fixture.detectChanges();
        });
        it('shold show the expected card and section titles', () => {
            const cardTitleDe = fixture.debugElement.query(By.css('[data-testid="schule-card-title"]'));
            expect(cardTitleDe.nativeElement.textContent.trim()).toBe('Schule');

            const sectionDsgvoTitleDe = fixture.debugElement.query(By.css('[data-testid="section-dsgvo-title"]'));
            expect(sectionDsgvoTitleDe.nativeElement.textContent.trim()).toBe('DSGVO-Vertrag');
        });

        it('should show the expected description and button label when vertragDsgvoVorhanden false', () => {
            const aktuellerWettbewerbskontext: SchuleWettbewerbskontext = {
                ...wettbewerbskontext,
                vertragDSGVOVorhanden: false,
            };

            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();

            const hinweisDe = fixture.debugElement.query(By.css('[data-testid="dsgvo-hinweis"]'));
            expect(hinweisDe.nativeElement.textContent.trim()).toBe(
                'Für diese Schule wurde noch kein DSGVO-Vertrag abgeschlossen.'
            );

            const buttonDe = fixture.debugElement.query(By.css('[data-testid="dsgvo-btn"]'));
            expect(buttonDe.nativeElement.textContent.trim()).toBe('Vertrag abschließen');
        });

        it('should show the expected description and button label when vertragDsgvoVorhanden true', () => {
            const aktuellerWettbewerbskontext: SchuleWettbewerbskontext = {
                ...wettbewerbskontext,
                vertragDSGVOVorhanden: true,
            };

            wettbewerbskontextSignal.set(aktuellerWettbewerbskontext);
            fixture.detectChanges();

            const hinweisDe = fixture.debugElement.query(By.css('[data-testid="dsgvo-hinweis"]'));
            expect(hinweisDe.nativeElement.textContent.trim()).toBe('Vertrag vorhanden');

            const buttonDe = fixture.debugElement.query(By.css('[data-testid="dsgvo-btn"]'));
            expect(buttonDe.nativeElement.textContent.trim()).toContain('Herunterladen');
        });

        it('should show the expected section kollegen title when there are some', () => {
            const sectionKollegenTitleDe = fixture.debugElement.query(
                By.css('[data-testid="section-kollegium-title"]')
            );
            expect(sectionKollegenTitleDe.nativeElement.textContent.trim()).toBe('Kolleginnen / Kollegen');

            const alleKollegenDe = fixture.debugElement.queryAll(By.css('[data-testid="kollege"]'));
            expect(alleKollegenDe.length).toBe(2);
            expect(alleKollegenDe[0].nativeElement.textContent.trim()).toBe('Anna Johanna');
            expect(alleKollegenDe[1].nativeElement.textContent.trim()).toBe('Hermann Mann');
        });

        it('should not show the kollegen section when there are no', () => {
            wettbewerbskontextSignal.set({ ...wettbewerbskontext, kollegen: [] });
            fixture.detectChanges();
            const sectionKollegenTitleDe = fixture.debugElement.query(
                By.css('[data-testid="section-kollegium-title"]')
            );
            expect(sectionKollegenTitleDe).toBeFalsy();
        });
    });

    describe('fruehere Teilnahmen', () => {
        beforeEach(() => {
            schulkollegiumLoadedSignal.set(true);
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
                'Für diese Schule liegen noch keine früheren Teilnahmen vor.'
            );
        });

        it('should show the teilnahmen and download button', () => {
            const theTeilnahmen: TeilnahmeReferenz[] = [
                ...teilnahmen,
                {
                    jahr: 2026,
                    teilnahmenummer: 'S1234567',
                },
                {
                    jahr: 2019,
                    teilnahmenummer: 'S1234567',
                },
            ];
            wettbewerbskontextSignal.set({ ...wettbewerbskontext, teilnahmerefs: theTeilnahmen });
            fixture.detectChanges();

            const teilnahmenDivDe = fixture.debugElement.query(By.css('.schule-dashboard__participations'));
            expect(teilnahmenDivDe).toBeTruthy();

            const teilnahmeRefDes = fixture.debugElement.queryAll(By.css('.schule-dashboard__year'));
            expect(teilnahmeRefDes.length).toBe(2);
            expect(teilnahmeRefDes[0].nativeElement.textContent.trim()).toBe('2020');
            expect(teilnahmeRefDes[1].nativeElement.textContent.trim()).toBe('2019');

            const downloadBtnDe = fixture.debugElement.queryAll(By.css('[data-testid="download-teilnahme-btn"]'));
            expect(downloadBtnDe.length).toBe(2);
            expect(downloadBtnDe[0].nativeElement.textContent.trim()).toContain('Statistik');
        });
    });
});
