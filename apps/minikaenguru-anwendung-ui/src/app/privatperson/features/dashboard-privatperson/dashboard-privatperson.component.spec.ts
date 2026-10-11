import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPrivatpersonComponent } from './dashboard-privatperson.component';

describe('DashboardPrivatComponent', () => {
    let component: DashboardPrivatpersonComponent;
    let fixture: ComponentFixture<DashboardPrivatpersonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardPrivatpersonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardPrivatpersonComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
