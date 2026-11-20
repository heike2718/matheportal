import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KlasseDashboardComponent } from './klasse-dashboard.component';

describe('KlasseDashboardComponent', () => {
    let component: KlasseDashboardComponent;
    let fixture: ComponentFixture<KlasseDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KlasseDashboardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(KlasseDashboardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
