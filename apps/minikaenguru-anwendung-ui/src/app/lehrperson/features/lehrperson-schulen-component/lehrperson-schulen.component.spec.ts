import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LehrpersonSchulenComponent } from './lehrperson-schulen.component';
import { Ort, Schule } from '../../../core/model/schulkatalog.model';
import { SchuleCardComponent } from '../../../shared/components/schule-card-component/schule-card.component';
import { MockComponent, ngMocks } from 'ng-mocks';
import { By } from '@angular/platform-browser';

describe('LehrpersonSchulenComponent', () => {
    const ort: Ort = {
        name: 'Ort 1',
        kuerzel: 'O-1',
        land: {
            kuerzel: 'DE-HE',
            name: 'Hessen',
            anzahlOrte: 8,
        },
        anzahlSchulen: 2,
    };

    const schulen: Schule[] = [
        {
            kuerzel: 'S-1',
            name: 'erste Schule',
            ort,
        },
        {
            kuerzel: 'S-2',
            name: 'zweite Schule',
            ort,
        },
    ];

    let component: LehrpersonSchulenComponent;
    let fixture: ComponentFixture<LehrpersonSchulenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LehrpersonSchulenComponent],
        })
            .overrideComponent(LehrpersonSchulenComponent, {
                remove: { imports: [SchuleCardComponent] },
                add: { imports: [MockComponent(SchuleCardComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(LehrpersonSchulenComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('schulen', schulen);
        fixture.componentRef.setInput('schulenLoaded', true);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('schulen loaded', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('schulen', schulen);
            fixture.componentRef.setInput('schulenLoaded', true);

            await fixture.whenStable();

            fixture.detectChanges();
        });

        it('should show the schulen when schulenLoaded', async () => {
            expect(component).toBeTruthy();

            const schuleCardsDe = getSchuleCards();

            expect(schuleCardsDe).toHaveLength(2);
            expect(ngMocks.input(schuleCardsDe[0], 'schule')).toEqual(schulen[0]);
            expect(ngMocks.input(schuleCardsDe[1], 'schule')).toEqual(schulen[1]);
        });

        it('should re-emit schuleSelected when SchuleCardComponent emits schuleSelected', () => {
            const schuleSelectedSpy = vi.spyOn(component.schuleSelected, 'emit');

            const schuleCardDe = fixture.debugElement.queryAll(By.directive(SchuleCardComponent));

            expect(schuleCardDe).toHaveLength(2);

            ngMocks.output(schuleCardDe[0], 'schuleSelected').emit(schulen[0]);
            expect(schuleSelectedSpy).toHaveBeenCalledExactlyOnceWith(schulen[0]);
        });
    });

    describe('schulen not loaded', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('schulen', schulen);
            fixture.componentRef.setInput('schulenLoaded', false);

            fixture.detectChanges();
        });

        it('should not show school cards even when schools are available', () => {
            expect(getSchuleCards()).toHaveLength(0);

            expect(fixture.debugElement.query(By.css('.mka-lehrperson-schulen__results'))).toBeNull();
        });
    });

    function getSchuleCards() {
        return fixture.debugElement.queryAll(By.directive(SchuleCardComponent));
    }
});
