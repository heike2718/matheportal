import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLehrpersonComponent } from './dashboard-lehrperson.component';
import { signal, Signal, WritableSignal } from '@angular/core';
import { Schule } from '../../../core/model/schulkatalog.model';
import { LehrpersonFacade } from '../../api/lehrperson.facade';

describe('DashboardLehrerComponent', () => {
    let component: DashboardLehrpersonComponent;
    let fixture: ComponentFixture<DashboardLehrpersonComponent>;

    let schulenSignal: WritableSignal<Schule[]>;
    let isSchulenLoadedSignal: WritableSignal<boolean>;

    let facadeMock: {
        isSchulenLoaded: Signal<boolean>;
        schulen: Signal<Schule[]>;
        schuleAusgewaehlt: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        isSchulenLoadedSignal = signal(false);
        schulenSignal = signal([]);

        facadeMock = {
            schulen: schulenSignal,
            isSchulenLoaded: isSchulenLoadedSignal,
            schuleAusgewaehlt: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [DashboardLehrpersonComponent],
            providers: [
                {
                    provide: LehrpersonFacade,
                    useValue: facadeMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardLehrpersonComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
