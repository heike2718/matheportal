import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Klasse } from '../../model/klasse.model';
import { KlasseCardComponent } from './klasse-card.component';

describe('KlasseCardComponent', () => {
    const klasse: Klasse = {
        uuid: 'K-1',
        schulkuerzel: 'S-1',
        name: '1a',
    };

    let component: KlasseCardComponent;
    let fixture: ComponentFixture<KlasseCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KlasseCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(KlasseCardComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('klasse', klasse);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show the name of the klasse', () => {
        const nameDe = fixture.debugElement.query(By.css('.mka-klasse-card__name'));

        expect(nameDe).toBeTruthy();
        expect(nameDe.nativeElement.textContent.trim()).toBe('1a');
    });

    it('should emit klasseSelected when clicked', () => {
        const emitSpy = vi.spyOn(component.klasseSelected, 'emit');
        const buttonDe = fixture.debugElement.query(By.css('button.mka-klasse-card'));

        expect(buttonDe).toBeTruthy();
        expect(buttonDe.nativeElement.type).toBe('button');

        buttonDe.nativeElement.click();

        expect(emitSpy).toHaveBeenCalledExactlyOnceWith(klasse);
    });

    it('should show and emit the updated klasse when the input changes', () => {
        const updatedKlasse: Klasse = {
            ...klasse,
            name: '1b',
        };
        const emitSpy = vi.spyOn(component.klasseSelected, 'emit');

        fixture.componentRef.setInput('klasse', updatedKlasse);
        fixture.detectChanges();

        const nameDe = fixture.debugElement.query(By.css('.mka-klasse-card__name'));
        expect(nameDe.nativeElement.textContent.trim()).toBe('1b');

        const buttonDe = fixture.debugElement.query(By.css('button.mka-klasse-card'));
        buttonDe.nativeElement.click();

        expect(emitSpy).toHaveBeenCalledExactlyOnceWith(updatedKlasse);
    });
});
