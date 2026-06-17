import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaetselSucheComponent } from './raetsel-suche.component';

describe('RaetselSucheComponent', () => {
    let component: RaetselSucheComponent;
    let fixture: ComponentFixture<RaetselSucheComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RaetselSucheComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RaetselSucheComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
