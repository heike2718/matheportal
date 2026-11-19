import { Component, DebugElement, signal, Signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { filter, firstValueFrom, take } from 'rxjs';
import { SchulteilnahmeComponent } from './schulteilnahme.component';
import { AUSWERUNGSART, Teilnahme } from '../../../model/teilnahme.model';
import { SchulteilnahmeFacade } from '../../api/schulteilnahme.facade';
import { By } from '@angular/platform-browser';

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

    const dashboardUrl = '/minikaenguru-anwendung/lehrperson/schule/S1234567';
    const teilnahmeUrl = `${dashboardUrl}/teilnahme`;

    let harness: RouterTestingHarness;
    let router: Router;

    let aktuelleTeilnahmeSignal: WritableSignal<Teilnahme | undefined>;

    let schulteilnahmeFacadeMock: {
        aktuelleTeilnahme: Signal<Teilnahme | undefined>;
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

    beforeEach(async () => {
        aktuelleTeilnahmeSignal = signal(teilnahme);

        schulteilnahmeFacadeMock = {
            aktuelleTeilnahme: aktuelleTeilnahmeSignal,
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
        }).compileComponents();

        router = TestBed.inject(Router);
        harness = await RouterTestingHarness.create();
        await harness.navigateByUrl(teilnahmeUrl, SchulteilnahmeComponent);
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

    it('should show the TeilnahmeInfoComponent', () => {
        const routeDebugElement = getRouteDebugElement();

        const teilnahmeInfoComponentDe = routeDebugElement.query(By.css('mka-teilnahme-info'));

        expect(teilnahmeInfoComponentDe).toBeTruthy();
    });

    it('should show the KlassenListComponent when Auswertungsart online', () => {
        const routeDebugElement = getRouteDebugElement();

        const klassenListComponentDe = routeDebugElement.query(By.css('mka-klassen-list'));

        expect(klassenListComponentDe).toBeTruthy();
    });

    it('should not show the KlassenListComponent when Auswertungsart online', () => {
        aktuelleTeilnahmeSignal.set({ ...teilnahme, auswertungsart: AUSWERUNGSART.offline });
        harness.detectChanges();

        const routeDebugElement = getRouteDebugElement();

        const klassenListComponentDe = routeDebugElement.query(By.css('mka-klassen-list'));

        expect(klassenListComponentDe).toBe(null);
    });

    it('should neigther show the TeilnahmeInfoComponent nor the KlassenListComponent when aktuelleAuswertung is undefined', () => {
        aktuelleTeilnahmeSignal.set(undefined);
        harness.detectChanges();

        const routeDebugElement = getRouteDebugElement();

        const teilnahmeInfoComponentDe = routeDebugElement.query(By.css('mka-teilnahme-info'));
        expect(teilnahmeInfoComponentDe).toBe(null);

        const klassenListComponentDe = routeDebugElement.query(By.css('mka-klassen-list'));
        expect(klassenListComponentDe).toBe(null);
    });
});
