import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LadefehlerComponent } from './ladefehler.component';

describe('LadefehlerComponent', () => {
    let component: LadefehlerComponent;
    let fixture: ComponentFixture<LadefehlerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LadefehlerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LadefehlerComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
