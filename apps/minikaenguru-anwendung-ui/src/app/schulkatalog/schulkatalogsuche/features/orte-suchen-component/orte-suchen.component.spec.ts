import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrteSuchenComponent } from './orte-suchen.component';
import { Ort } from '../../model/schulkatalog.model';

describe('OrteSuchenComponentComponent', () => {
    let component: OrteSuchenComponent;
    let fixture: ComponentFixture<OrteSuchenComponent>;

    const orte: Ort[] = [
        {
            kuerzel: 'ORT-1',
            name: 'erster Ort',
            land: {
                kuerzel: 'DE-BY',
                name: 'Bayern',
            },
            anzahlSchulen: 10,
        },
        {
            kuerzel: 'ORT-2',
            name: 'zweiter Ort',
            land: {
                kuerzel: 'DE-HE',
                name: 'Hessen',
            },
            anzahlSchulen: 5,
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrteSuchenComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OrteSuchenComponent);
        component = fixture.componentInstance;

        // WICHTIG: Setze alle required Inputs VOR dem ersten detectChanges()
        fixture.componentRef.setInput('orte', orte);
        fixture.componentRef.setInput('orteLoaded', true);

        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
