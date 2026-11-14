import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchulteilnahmeComponent } from './schulteilnahme.component';

describe('SchulteilnahmeComponent', () => {
    let component: SchulteilnahmeComponent;
    let fixture: ComponentFixture<SchulteilnahmeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SchulteilnahmeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SchulteilnahmeComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
