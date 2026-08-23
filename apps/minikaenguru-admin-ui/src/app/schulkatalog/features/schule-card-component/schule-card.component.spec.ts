import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchuleCardComponent } from './schule-card.component';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { By } from '@angular/platform-browser';

describe('SchuleCardComponent', () => {
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

    const schule: Schule = {
        ort,
        kuerzel: '5FE42L89',
        name: 'Goetheschule',
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
        const nameDe = fixture.debugElement.query(By.css('.mk-admin-schule-card__name'));
        expect(nameDe).toBeTruthy();
        expect(nameDe.nativeElement.textContent.trim()).toBe('Goetheschule (5FE42L89)');

        const ortDe = fixture.debugElement.query(By.css('.mk-admin-schule-card__ort'));
        expect(ortDe).toBeTruthy();
        expect(ortDe.nativeElement.textContent.trim()).toBe('Sangerhausen (DE-SA)');
    });

    it('should emit schuleUmbenennenSelected when clicked', () => {
        fixture.detectChanges();
        const emitSpy = vi.spyOn(component.schuleUmbenennenSelected, 'emit');
        const buttonUmbenennenDe = fixture.debugElement.query(By.css('.mk-admin-schule-card__action'));
        expect(buttonUmbenennenDe).toBeTruthy();
        expect(buttonUmbenennenDe.nativeElement.textContent.trim()).toBe('umbenennen');

        buttonUmbenennenDe.triggerEventHandler('click', null);
        expect(emitSpy).toHaveBeenCalledOnce();

        expect(emitSpy).toHaveBeenCalledWith(schule);
    });
});
