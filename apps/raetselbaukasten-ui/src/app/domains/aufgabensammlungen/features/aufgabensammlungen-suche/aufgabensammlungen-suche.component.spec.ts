import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AufgabensammlungenSucheComponent } from './aufgabensammlungen-suche.component';

describe('AufgabensammlungenSucheComponent', () => {
    let component: AufgabensammlungenSucheComponent;
    let fixture: ComponentFixture<AufgabensammlungenSucheComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AufgabensammlungenSucheComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AufgabensammlungenSucheComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
