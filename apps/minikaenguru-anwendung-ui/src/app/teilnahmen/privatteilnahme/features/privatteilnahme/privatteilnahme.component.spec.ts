import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivatteilnahmeComponent } from './privatteilnahme.component';

describe('PrivatteilnahmeComponent', () => {
    let component: PrivatteilnahmeComponent;
    let fixture: ComponentFixture<PrivatteilnahmeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PrivatteilnahmeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PrivatteilnahmeComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
