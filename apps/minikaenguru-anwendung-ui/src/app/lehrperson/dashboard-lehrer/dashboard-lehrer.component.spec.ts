import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLehrerComponent } from './dashboard-lehrer.component';

describe('DashboardLehrerComponent', () => {
    let component: DashboardLehrerComponent;
    let fixture: ComponentFixture<DashboardLehrerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardLehrerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardLehrerComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
