import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPrivatComponent } from './dashboard-privat.component';

describe('DashboardPrivatComponent', () => {
    let component: DashboardPrivatComponent;
    let fixture: ComponentFixture<DashboardPrivatComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardPrivatComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardPrivatComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
