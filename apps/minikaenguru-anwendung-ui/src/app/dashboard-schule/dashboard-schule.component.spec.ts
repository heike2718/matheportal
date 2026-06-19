import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardSchuleComponent } from './dashboard-schule.component';

describe('DashboardSchuleComponent', () => {
    let component: DashboardSchuleComponent;
    let fixture: ComponentFixture<DashboardSchuleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardSchuleComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardSchuleComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
