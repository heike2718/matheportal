import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestInfoComponent } from './guest-info.component';

describe('GuestInfoComponent', () => {
    let component: GuestInfoComponent;
    let fixture: ComponentFixture<GuestInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GuestInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GuestInfoComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
