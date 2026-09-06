import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchuleCardComponent } from './schule-card.component';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { By } from '@angular/platform-browser';

describe('SchuleCardComponentComponent', () => {
    const ort: Ort = {
        name: 'Ort 1',
        kuerzel: 'O-1',
        land: {
            kuerzel: 'DE-HE',
            name: 'Hessen',
            anzahlOrte: 8,
        },
        anzahlSchulen: 2,
    };

    const schule: Schule = {
        kuerzel: 'S-1',
        name: 'Erste Schule',
        ort,
    };

    let component: SchuleCardComponent;
    let fixture: ComponentFixture<SchuleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SchuleCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SchuleCardComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('schule', schule);

        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show all elements', () => {
        fixture.detectChanges();
        const nameDe = fixture.debugElement.query(By.css('.mka-schule-card__name'));
        expect(nameDe).toBeTruthy();
        expect(nameDe.nativeElement.textContent.trim()).toBe('Erste Schule');

        const landDe = fixture.debugElement.query(By.css('.mka-schule-card__land'));
        expect(landDe).toBeTruthy();
        expect(landDe.nativeElement.textContent.trim()).toBe('Hessen');
    });

    it('should emit schuleSelected when clicked', () => {
        fixture.detectChanges();
        const emitSpy = vi.spyOn(component.schuleSelected, 'emit');
        const buttonDe = fixture.debugElement.query(By.css('.mka-schule-card'));
        expect(buttonDe).toBeTruthy();

        buttonDe.triggerEventHandler('click', null);
        expect(emitSpy).toHaveBeenCalledOnce();

        expect(emitSpy).toHaveBeenCalledWith(schule);
    });
});
