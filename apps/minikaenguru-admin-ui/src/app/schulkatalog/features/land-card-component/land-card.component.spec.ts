import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Land } from '../../model/schulkatalog.model';
import { By } from '@angular/platform-browser';
import { LandCardComponent } from './land-card.component';

describe('LandCardComponent', () => {
    const land: Land = {
        kuerzel: 'DE-SA',
        name: 'Sachsen-Anhalt',
        anzahlOrte: 367,
    };

    let component: LandCardComponent;
    let fixture: ComponentFixture<LandCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LandCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LandCardComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('land', land);

        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show all elements', () => {
        fixture.detectChanges();
        const nameDe = fixture.debugElement.query(By.css('.mk-admin-land-card__name'));
        expect(nameDe).toBeTruthy();
        expect(nameDe.nativeElement.textContent.trim()).toBe('Sachsen-Anhalt (DE-SA)');

        const anzahlOrteDe = fixture.debugElement.query(By.css('.mk-admin-land-card__ort-count'));
        expect(anzahlOrteDe).toBeTruthy();
        expect(anzahlOrteDe.nativeElement.textContent.trim()).toBe('Anzahl Orte: 367');
    });

    it('should emit landSelected when clicked', () => {
        fixture.detectChanges();
        const emitSpy = vi.spyOn(component.landSelected, 'emit');
        const buttonDe = fixture.debugElement.query(By.css('.mk-admin-land-card'));
        expect(buttonDe).toBeTruthy();

        buttonDe.triggerEventHandler('click', null);
        expect(emitSpy).toHaveBeenCalledOnce();

        expect(emitSpy).toHaveBeenCalledWith(land);
    });
});
