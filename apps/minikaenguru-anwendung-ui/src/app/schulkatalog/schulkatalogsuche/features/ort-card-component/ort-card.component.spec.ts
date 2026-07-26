import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrtCardComponent } from './ort-card.component';
import { Ort } from '../../model/schulkatalog.model';

describe('OrtCardComponentComponent', () => {
    const ort: Ort = {
        kuerzel: 'ORT-1',
        name: 'erster Ort',
        land: {
            kuerzel: 'DE-BY',
            name: 'Bayern',
        },
        anzahlSchulen: 10,
    };

    let component: OrtCardComponent;
    let fixture: ComponentFixture<OrtCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrtCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OrtCardComponent);
        component = fixture.componentInstance;

        // WICHTIG: Setze alle required Inputs VOR dem ersten detectChanges()
        fixture.componentRef.setInput('ort', ort);

        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
