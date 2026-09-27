import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLehrpersonComponent } from './dashboard-lehrperson.component';

describe('DashboardLehrerComponent', () => {
    let component: DashboardLehrpersonComponent;
    let fixture: ComponentFixture<DashboardLehrpersonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardLehrpersonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardLehrpersonComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
