import { Component, DebugElement, signal, Signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MockComponent, ngMocks } from 'ng-mocks';
import { filter, firstValueFrom, take } from 'rxjs';
import { TeilnahmeInfoComponent } from '../../../components/teilnahme-info/teilnahme-info.component';
import { AUSWERUNGSART, Teilnahme } from '../../../model/teilnahme.model';
import { SchulteilnahmeFacade } from '../../api/schulteilnahme.facade';
import { Klasse } from '../../model/klasse.model';
import { KlassenListComponent } from '../klassen-list/klassen-list.component';
import { SchulteilnahmeComponent } from './schulteilnahme.component';

@Component({
    selector: 'mka-schule-dashboard-test',
    template: '<p>Schulübersicht</p>',
})
class SchuleDashboardTestComponent {}

describe('SchulteilnahmeComponent', () => {
    const teilnahme: Teilnahme = {
        angemeldetAm: '02.04.2026',
        anzahlKinder: 3,
        anzahlKlassen: 1,
        anzahlLoesungszettel: 2,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: 'SCHULE',
        jahr: 2026,
        kuerzel: 'S1234567',
    };

    const klassen: Klasse[] = [
        {
            uuid: 'K-1',
            schulkuerzel: 'S1234567',
            name: '1a',
        },
    ];

    const dashboardUrl = '/minikaenguru-anwendung/lehrperson/schule/S1234567';
    const teilnahmeUrl = `${dashboardUrl}/teilnahme`;

    let harness: RouterTestingHarness;
    let router: Router;
    let component: SchulteilnahmeComponent;

    let aktuelleTeilnahmeSignal: WritableSignal<Teilnahme | undefined>;
    let klassenSignal: WritableSignal<Klasse[]>;

    let schulteilnahmeFacadeMock: {
        aktuelleTeilnahme: Signal<Teilnahme | undefined>;
        klassen: Signal<Klasse[]>;
        klasseAusgewaehlt: ReturnType<typeof vi.fn>;
        klasseAnlegenRequested: ReturnType<typeof vi.fn>;
        alleKlassenLoeschenRequested: ReturnType<typeof vi.fn>;
    };

    function getZurSchuleLink(): HTMLAnchorElement {
        const element = harness.routeNativeElement;

        if (element === null) {
            throw new Error('Die geroutete Komponente wurde nicht gerendert.');
        }

        const link = element.querySelector<HTMLAnchorElement>('[data-testid="zur-schule-link"]');

        if (link === null) {
            throw new Error('Der Link zur Schulübersicht wurde nicht gefunden.');
        }

        return link;
    }

    function getRouteDebugElement(): DebugElement {
        const routeDebugElement = harness.routeDebugElement;

        if (routeDebugElement === null) {
            throw new Error('routeDebugElement ist null');
        }

        return routeDebugElement;
    }

    function getKlassenList(): DebugElement {
        const klassenListDe = getRouteDebugElement().query(By.directive(KlassenListComponent));

        if (klassenListDe === null) {
            throw new Error('Die KlassenListComponent wurde nicht gerendert.');
        }

        return klassenListDe;
    }

    beforeEach(async () => {
        aktuelleTeilnahmeSignal = signal(teilnahme);
        klassenSignal = signal(klassen);

        schulteilnahmeFacadeMock = {
            aktuelleTeilnahme: aktuelleTeilnahmeSignal,
            klassen: klassenSignal,
            klasseAusgewaehlt: vi.fn(),
            klasseAnlegenRequested: vi.fn(),
            alleKlassenLoeschenRequested: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [SchulteilnahmeComponent, SchuleDashboardTestComponent],
            providers: [
                provideRouter([
                    {
                        path: 'minikaenguru-anwendung',
                        children: [
                            {
                                path: 'lehrperson',
                                children: [
                                    {
                                        path: 'schule/:schulkuerzel',
                                        children: [
                                            {
                                                path: '',
                                                pathMatch: 'full',
                                                component: SchuleDashboardTestComponent,
                                            },
                                            {
                                                path: 'teilnahme',
                                                component: SchulteilnahmeComponent,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ]),
                {
                    provide: SchulteilnahmeFacade,
                    useValue: schulteilnahmeFacadeMock,
                },
            ],
        })
            .overrideComponent(SchulteilnahmeComponent, {
                remove: {
                    imports: [TeilnahmeInfoComponent, KlassenListComponent],
                },
                add: {
                    imports: [MockComponent(TeilnahmeInfoComponent), MockComponent(KlassenListComponent)],
                },
            })
            .compileComponents();

        router = TestBed.inject(Router);
        harness = await RouterTestingHarness.create();
        component = await harness.navigateByUrl(teilnahmeUrl, SchulteilnahmeComponent);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should link to the dashboard of the current school', () => {
        const link = getZurSchuleLink();

        expect(link.getAttribute('href')).toBe(dashboardUrl);
        expect(link.textContent?.trim()).toBe('zurück zur Schulübersicht');
    });

    it('should navigate to the school dashboard when the link is clicked', async () => {
        const link = getZurSchuleLink();

        const navigationFinished = firstValueFrom(
            router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                take(1)
            )
        );

        link.click();
        await navigationFinished;
        harness.detectChanges();

        expect(router.url).toBe(dashboardUrl);
        expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(SchuleDashboardTestComponent);
    });

    it('should pass the aktuelleTeilnahme to the TeilnahmeInfoComponent', () => {
        const teilnahmeInfoDe = getRouteDebugElement().query(By.directive(TeilnahmeInfoComponent));

        expect(teilnahmeInfoDe).toBeTruthy();
        expect(ngMocks.input(teilnahmeInfoDe, 'teilnahme')).toEqual(teilnahme);
    });

    it('should update the TeilnahmeInfoComponent when aktuelleTeilnahme changes', () => {
        const updatedTeilnahme: Teilnahme = {
            ...teilnahme,
            anzahlKinder: 5,
        };

        aktuelleTeilnahmeSignal.set(updatedTeilnahme);
        harness.detectChanges();

        const teilnahmeInfoDe = getRouteDebugElement().query(By.directive(TeilnahmeInfoComponent));

        expect(teilnahmeInfoDe).toBeTruthy();
        expect(ngMocks.input(teilnahmeInfoDe, 'teilnahme')).toEqual(updatedTeilnahme);
    });

    it('should show the KlassenListComponent with klassen when Auswertungsart is online', () => {
        expect(ngMocks.input(getKlassenList(), 'klassen')).toEqual(klassen);
    });

    it('should update the KlassenListComponent when klassen change', () => {
        const updatedKlassen: Klasse[] = [
            ...klassen,
            {
                uuid: 'K-2',
                schulkuerzel: 'S1234567',
                name: '2b',
            },
        ];

        klassenSignal.set(updatedKlassen);
        harness.detectChanges();

        expect(ngMocks.input(getKlassenList(), 'klassen')).toEqual(updatedKlassen);
    });

    it('should keep the KlassenListComponent visible when klassen are empty', () => {
        klassenSignal.set([]);
        harness.detectChanges();

        expect(ngMocks.input(getKlassenList(), 'klassen')).toEqual([]);
    });

    it('should show the TeilnahmeInfoComponent but no KlassenListComponent when Auswertungsart is offline', () => {
        const offlineTeilnahme: Teilnahme = {
            ...teilnahme,
            auswertungsart: AUSWERUNGSART.offline,
        };

        aktuelleTeilnahmeSignal.set(offlineTeilnahme);
        harness.detectChanges();

        const routeDebugElement = getRouteDebugElement();
        const teilnahmeInfoDe = routeDebugElement.query(By.directive(TeilnahmeInfoComponent));

        expect(teilnahmeInfoDe).toBeTruthy();
        expect(ngMocks.input(teilnahmeInfoDe, 'teilnahme')).toEqual(offlineTeilnahme);
        expect(routeDebugElement.query(By.directive(KlassenListComponent))).toBeNull();
    });

    it('should show the KlassenListComponent again when Auswertungsart changes to online', () => {
        aktuelleTeilnahmeSignal.set({
            ...teilnahme,
            auswertungsart: AUSWERUNGSART.offline,
        });
        harness.detectChanges();

        expect(getRouteDebugElement().query(By.directive(KlassenListComponent))).toBeNull();

        aktuelleTeilnahmeSignal.set(teilnahme);
        harness.detectChanges();

        expect(ngMocks.input(getKlassenList(), 'klassen')).toEqual(klassen);
    });

    it('should show neither child component but keep the back link when aktuelleTeilnahme is undefined', () => {
        aktuelleTeilnahmeSignal.set(undefined);
        harness.detectChanges();

        const routeDebugElement = getRouteDebugElement();

        expect(routeDebugElement.query(By.directive(TeilnahmeInfoComponent))).toBeNull();
        expect(routeDebugElement.query(By.directive(KlassenListComponent))).toBeNull();
        expect(getZurSchuleLink().getAttribute('href')).toBe(dashboardUrl);
    });

    it('should show both child components when aktuelleTeilnahme becomes available', () => {
        aktuelleTeilnahmeSignal.set(undefined);
        harness.detectChanges();

        aktuelleTeilnahmeSignal.set(teilnahme);
        harness.detectChanges();

        const teilnahmeInfoDe = getRouteDebugElement().query(By.directive(TeilnahmeInfoComponent));

        expect(teilnahmeInfoDe).toBeTruthy();
        expect(ngMocks.input(teilnahmeInfoDe, 'teilnahme')).toEqual(teilnahme);
        expect(ngMocks.input(getKlassenList(), 'klassen')).toEqual(klassen);
    });

    it('should call klasseAusgewaehlt when the KlassenListComponent emits klasseSelected', () => {
        ngMocks.output(getKlassenList(), 'klasseSelected').emit(klassen[0]);

        expect(schulteilnahmeFacadeMock.klasseAusgewaehlt).toHaveBeenCalledExactlyOnceWith(klassen[0]);
    });

    it('should call klasseAnlegenRequested when the KlassenListComponent emits klasseAnlegen', () => {
        ngMocks.output(getKlassenList(), 'klasseAnlegen').emit();

        expect(schulteilnahmeFacadeMock.klasseAnlegenRequested).toHaveBeenCalledExactlyOnceWith();
    });

    it('should call alleKlassenLoeschenRequested when the KlassenListComponent emits alleKlassenLoeschen', () => {
        ngMocks.output(getKlassenList(), 'alleKlassenLoeschen').emit();

        expect(schulteilnahmeFacadeMock.alleKlassenLoeschenRequested).toHaveBeenCalledExactlyOnceWith();
    });

    it('should call the upload handler when the KlassenListComponent emits klassenlisteHochladen', () => {
        const uploadSpy = vi.spyOn(component, 'onKlassenlisteHochladen').mockImplementation(() => undefined);

        ngMocks.output(getKlassenList(), 'klassenlisteHochladen').emit();

        expect(uploadSpy).toHaveBeenCalledExactlyOnceWith();
    });
});
