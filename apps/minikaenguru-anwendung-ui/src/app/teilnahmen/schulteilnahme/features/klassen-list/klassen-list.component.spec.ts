import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent, ngMocks } from 'ng-mocks';
import { Klasse } from '../../model/klasse.model';
import { KlasseCardComponent } from '../klasse-card/klasse-card.component';
import { KlassenListComponent } from './klassen-list.component';

describe('KlassenListComponent', () => {
    const klassen: Klasse[] = [
        {
            uuid: 'K-1',
            schulkuerzel: 'S-1',
            name: '1a',
        },
        {
            uuid: 'K-2',
            schulkuerzel: 'S-1',
            name: '2b',
        },
    ];

    let component: KlassenListComponent;
    let fixture: ComponentFixture<KlassenListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KlassenListComponent],
        })
            .overrideComponent(KlassenListComponent, {
                remove: { imports: [KlasseCardComponent] },
                add: { imports: [MockComponent(KlasseCardComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(KlassenListComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('klassen', klassen);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show the number of klassen and pass each klasse to its card', () => {
        const resultCountDe = fixture.debugElement.query(By.css('.mka-klassen-list__result-count'));

        expect(resultCountDe).toBeTruthy();
        expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl Klassen: 2');

        const cardsDe = getKlasseCards();

        expect(cardsDe).toHaveLength(2);
        expect(ngMocks.input(cardsDe[0], 'klasse')).toEqual(klassen[0]);
        expect(ngMocks.input(cardsDe[1], 'klasse')).toEqual(klassen[1]);
    });

    it('should emit the selected klasse for each card', () => {
        const emitSpy = vi.spyOn(component.klasseSelected, 'emit');
        const cardsDe = getKlasseCards();

        expect(cardsDe).toHaveLength(2);

        ngMocks.output(cardsDe[0], 'klasseSelected').emit(klassen[0]);
        ngMocks.output(cardsDe[1], 'klasseSelected').emit(klassen[1]);

        expect(emitSpy).toHaveBeenCalledTimes(2);
        expect(emitSpy).toHaveBeenNthCalledWith(1, klassen[0]);
        expect(emitSpy).toHaveBeenNthCalledWith(2, klassen[1]);
    });

    it('should emit klassenlisteHochladen when the upload button is clicked', () => {
        const emitSpy = vi.spyOn(component.klassenlisteHochladen, 'emit');
        const buttonDe = fixture.debugElement.query(By.css('[data-testid="btn-upload"]'));

        expect(buttonDe).toBeTruthy();
        expect(buttonDe.nativeElement.textContent.trim()).toBe('Klassenliste hochladen');

        buttonDe.nativeElement.click();

        expect(emitSpy).toHaveBeenCalledExactlyOnceWith();
    });

    it('should emit klasseAnlegen when the neue klasse button is clicked', () => {
        const emitSpy = vi.spyOn(component.klasseAnlegen, 'emit');
        const buttonDe = fixture.debugElement.query(By.css('[data-testid="btn-neue-klasse"]'));

        expect(buttonDe).toBeTruthy();
        expect(buttonDe.nativeElement.textContent.trim()).toBe('Neue Klasse');

        buttonDe.nativeElement.click();

        expect(emitSpy).toHaveBeenCalledExactlyOnceWith();
    });

    it('should emit alleKlassenLoeschen when the delete button is clicked', () => {
        const emitSpy = vi.spyOn(component.alleKlassenLoeschen, 'emit');
        const buttonDe = fixture.debugElement.query(By.css('[data-testid="btn-klassen-loeschen"]'));

        expect(buttonDe).toBeTruthy();
        expect(buttonDe.nativeElement.textContent.trim()).toBe('Alle Klassen löschen');

        buttonDe.nativeElement.click();

        expect(emitSpy).toHaveBeenCalledExactlyOnceWith();
    });

    it('should update the count and cards when klassen change', () => {
        const updatedKlasse: Klasse = {
            ...klassen[1],
            name: '2c',
        };

        fixture.componentRef.setInput('klassen', [updatedKlasse]);
        fixture.detectChanges();

        const resultCountDe = fixture.debugElement.query(By.css('.mka-klassen-list__result-count'));
        expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl Klassen: 1');

        const cardsDe = getKlasseCards();

        expect(cardsDe).toHaveLength(1);
        expect(ngMocks.input(cardsDe[0], 'klasse')).toEqual(updatedKlasse);

        const emitSpy = vi.spyOn(component.klasseSelected, 'emit');

        ngMocks.output(cardsDe[0], 'klasseSelected').emit(updatedKlasse);

        expect(emitSpy).toHaveBeenCalledExactlyOnceWith(updatedKlasse);
    });

    describe('without klassen', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('klassen', []);
            fixture.detectChanges();
        });

        it('should show zero klassen and no cards or delete button', () => {
            const resultCountDe = fixture.debugElement.query(By.css('.mka-klassen-list__result-count'));

            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl Klassen: 0');
            expect(getKlasseCards()).toHaveLength(0);

            const deleteButtonDe = fixture.debugElement.query(By.css('[data-testid="btn-klassen-loeschen"]'));
            expect(deleteButtonDe).toBeFalsy();
        });

        it('should still allow uploading a list and creating a klasse', () => {
            const uploadSpy = vi.spyOn(component.klassenlisteHochladen, 'emit');
            const anlegenSpy = vi.spyOn(component.klasseAnlegen, 'emit');

            const uploadButtonDe = fixture.debugElement.query(By.css('[data-testid="btn-upload"]'));
            const anlegenButtonDe = fixture.debugElement.query(By.css('[data-testid="btn-neue-klasse"]'));

            expect(uploadButtonDe).toBeTruthy();
            expect(anlegenButtonDe).toBeTruthy();

            uploadButtonDe.nativeElement.click();
            anlegenButtonDe.nativeElement.click();

            expect(uploadSpy).toHaveBeenCalledExactlyOnceWith();
            expect(anlegenSpy).toHaveBeenCalledExactlyOnceWith();
        });

        it('should show cards and the delete button when klassen are added', () => {
            fixture.componentRef.setInput('klassen', klassen);
            fixture.detectChanges();

            const resultCountDe = fixture.debugElement.query(By.css('.mka-klassen-list__result-count'));
            expect(resultCountDe.nativeElement.textContent.trim()).toBe('Anzahl Klassen: 2');
            expect(getKlasseCards()).toHaveLength(2);

            const deleteButtonDe = fixture.debugElement.query(By.css('[data-testid="btn-klassen-loeschen"]'));
            expect(deleteButtonDe).toBeTruthy();
        });
    });

    function getKlasseCards() {
        return fixture.debugElement.queryAll(By.directive(KlasseCardComponent));
    }
});
