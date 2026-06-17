import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedienSucheComponent } from './medien-suche.component';

describe('MedienSucheComponent', () => {
    let component: MedienSucheComponent;
    let fixture: ComponentFixture<MedienSucheComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MedienSucheComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MedienSucheComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
