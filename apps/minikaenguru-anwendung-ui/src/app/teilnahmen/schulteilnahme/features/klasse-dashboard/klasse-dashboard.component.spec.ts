import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KlasseDashboardComponent } from './klasse-dashboard.component';
import { signal, Signal, WritableSignal } from '@angular/core';
import { Klasse } from '../../model/klasse.model';
import { SchulteilnahmeFacade } from '../../api/schulteilnahme.facade';

describe('KlasseDashboardComponent', () => {
    let component: KlasseDashboardComponent;
    let fixture: ComponentFixture<KlasseDashboardComponent>;

    const klasse: Klasse = {
        name: 'Fuchsklasse',
        schulkuerzel: 'S1234567',
        uuid: 'abcdef',
    };

    let ausgewaehlteKlasseSignal: WritableSignal<Klasse | undefined>;

    let schulteilnahmeFacadeMock: {
        ausgewaehlteKlasse: Signal<Klasse | undefined>;
    };

    beforeEach(async () => {
        ausgewaehlteKlasseSignal = signal(klasse);

        schulteilnahmeFacadeMock = {
            ausgewaehlteKlasse: ausgewaehlteKlasseSignal,
        };

        await TestBed.configureTestingModule({
            imports: [KlasseDashboardComponent],
            providers: [
                {
                    provide: SchulteilnahmeFacade,
                    useValue: schulteilnahmeFacadeMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(KlasseDashboardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
