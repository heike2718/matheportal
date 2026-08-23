import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrtCardComponent } from './ort-card.component';
import { Land, Ort } from '../../model/schulkatalog.model';
import { By } from '@angular/platform-browser';

describe('OrtCardComponent', () => {
    const land: Land = {
        kuerzel: 'DE-SA',
        name: 'Sachsen-Anhalt',
        anzahlOrte: 367,
    };

    const ort: Ort = {
        land,
        kuerzel: 'F2314G7H',
        name: 'Sangerhausen',
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

        fixture.componentRef.setInput('ort', ort);

        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show all elements', () => {
        fixture.detectChanges();
        const nameDe = fixture.debugElement.query(By.css('.mk-admin-ort-card__name'));
        expect(nameDe).toBeTruthy();
        expect(nameDe.nativeElement.textContent.trim()).toBe('Sangerhausen (F2314G7H)');

        const landDe = fixture.debugElement.query(By.css('.mk-admin-ort-card__land'));
        expect(landDe).toBeTruthy();
        expect(landDe.nativeElement.textContent.trim()).toBe('Sachsen-Anhalt');

        const anzahlSchulenDe = fixture.debugElement.query(By.css('.mk-admin-ort-card__school-count'));
        expect(anzahlSchulenDe).toBeTruthy();
        expect(anzahlSchulenDe.nativeElement.textContent.trim()).toBe('Anzahl Schulen: 10');
    });

    it('should emit ortSelected when clicked', () => {
        fixture.detectChanges();
        const emitSpy = vi.spyOn(component.ortSelected, 'emit');
        const buttonDe = fixture.debugElement.query(By.css('.mk-admin-ort-card'));
        expect(buttonDe).toBeTruthy();

        buttonDe.triggerEventHandler('click', null);
        expect(emitSpy).toHaveBeenCalledOnce();

        expect(emitSpy).toHaveBeenCalledWith(ort);
    });
});
