import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeilnahmeInfoComponent } from './teilnahme-info.component';
import { AUSWERUNGSART, Teilnahme } from '../../model/teilnahme.model';
import { By } from '@angular/platform-browser';

describe('TeilnahmeInfoComponent', () => {
    let component: TeilnahmeInfoComponent;
    let fixture: ComponentFixture<TeilnahmeInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TeilnahmeInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TeilnahmeInfoComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('allgemeine elemente', () => {
        const teilnahme: Teilnahme = {
            angemeldetAm: '02.04.2026',
            anzahlKinder: 3,
            anzahlKlassen: 1,
            anzahlLoesungszettel: 2,
            auswertungsart: 'ONLINE',
            durchfuehrungsart: 'SCHULE',
            jahr: 2026,
            kuerzel: 'S1234567',
        };

        beforeEach(async () => {
            fixture.componentRef.setInput('teilnahme', teilnahme);
            fixture.detectChanges();

            await fixture.whenStable();
        });

        it('should show the elements that are rendered independent of auswertungsart', () => {
            expect(component).toBeTruthy();

            const titleDe = fixture.debugElement.query(By.css('.teilnahme-info__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Minikänguru 2026');

            const auswertungsartDe = fixture.debugElement.query(By.css('[data-testid="auswertungsart"]'));
            expect(auswertungsartDe).toBeTruthy();

            const angemeldetAmDe = fixture.debugElement.query(By.css('[data-testid="angemeldet-am"]'));
            expect(angemeldetAmDe.nativeElement.textContent.trim()).toBe('02.04.2026');

            const anzahlLoesungszettelDe = fixture.debugElement.query(By.css('[data-testid="anzahl-loesungszettel"]'));
            expect(anzahlLoesungszettelDe.nativeElement.textContent.trim()).toBe('2');
        });
    });

    describe('Online-Auswertung', () => {
        const teilnahme: Teilnahme = {
            angemeldetAm: '02.04.2026',
            anzahlKinder: 3,
            anzahlKlassen: 1,
            anzahlLoesungszettel: 2,
            auswertungsart: 'ONLINE',
            durchfuehrungsart: 'SCHULE',
            jahr: 2026,
            kuerzel: 'S1234567',
        };

        beforeEach(async () => {
            fixture.componentRef.setInput('teilnahme', teilnahme);
            fixture.detectChanges();

            await fixture.whenStable();
        });

        it('should the expected elements', () => {
            const auswertungsartDe = fixture.debugElement.query(By.css('[data-testid="auswertungsart"]'));
            expect(auswertungsartDe.nativeElement.textContent.trim()).toBe('Online-Auswertung');

            const anzahlKinderDe = fixture.debugElement.query(By.css('[data-testid="anzahl-kinder"]'));
            expect(anzahlKinderDe.nativeElement.textContent.trim()).toBe('3');
        });
    });

    describe('Schulteilnahme', () => {
        const teilnahme: Teilnahme = {
            angemeldetAm: '02.04.2026',
            angemeldetDurch: { fullName: 'Leo Lemma', schulkuerzel: 'S1234567' },
            anzahlKinder: 3,
            anzahlKlassen: 1,
            anzahlLoesungszettel: 2,
            auswertungsart: 'ONLINE',
            durchfuehrungsart: 'SCHULE',
            jahr: 2026,
            kuerzel: 'S1234567',
        };

        beforeEach(async () => {
            fixture.componentRef.setInput('teilnahme', teilnahme);
            fixture.detectChanges();

            await fixture.whenStable();
        });

        it('should render the expected elements of a Schulteilnahme', () => {
            const subtitleDe = fixture.debugElement.query(By.css('.teilnahme-info__subtitle'));
            expect(subtitleDe.nativeElement.textContent.trim()).toBe('Schulteilnahme');

            const angemeldetDurchDe = fixture.debugElement.query(By.css('[data-testid="angemeldet-durch"]'));
            expect(angemeldetDurchDe.nativeElement.textContent.trim()).toBe('Leo Lemma');
        });

        it('should not render angemeldetDurch when it is undefined', async () => {
            fixture.componentRef.setInput('teilnahme', { ...teilnahme, angemeldetDurch: undefined });
            fixture.detectChanges();

            await fixture.whenStable();

            const abschnittAngemeldetDurchDe = fixture.debugElement.query(
                By.css('[data-testid="abschnitt-angemeldet-durch"]')
            );
            expect(abschnittAngemeldetDurchDe).toBeFalsy();
        });

        it('should render the expected elements for an Online-Auswertung', () => {
            const auswertungsartDe = fixture.debugElement.query(By.css('[data-testid="auswertungsart"]'));
            expect(auswertungsartDe.nativeElement.textContent.trim()).toBe('Online-Auswertung');

            const anzahlKinderDe = fixture.debugElement.query(By.css('[data-testid="anzahl-kinder"]'));
            expect(anzahlKinderDe.nativeElement.textContent.trim()).toBe('3');
        });

        it('should render the expected elements for an Offline-Auswertung', async () => {
            fixture.componentRef.setInput('teilnahme', { ...teilnahme, auswertungsart: AUSWERUNGSART.offline });
            fixture.detectChanges();

            await fixture.whenStable();

            const auswertungsartDe = fixture.debugElement.query(By.css('[data-testid="auswertungsart"]'));
            expect(auswertungsartDe.nativeElement.textContent.trim()).toBe('Offline-Auswertung');

            const anzahlKinderDe = fixture.debugElement.query(By.css('[data-testid="anzahl-kinder"]'));
            expect(anzahlKinderDe).toBe(null);

            const angemeldetDurchDe = fixture.debugElement.query(By.css('[data-testid="angemeldet-durch"]'));
            expect(angemeldetDurchDe.nativeElement.textContent.trim()).toBe('Leo Lemma');
        });
    });

    describe('Privatteilnahme', () => {
        const teilnahme: Teilnahme = {
            angemeldetAm: '02.04.2026',
            anzahlKinder: 3,
            anzahlKlassen: 0,
            anzahlLoesungszettel: 2,
            auswertungsart: 'ONLINE',
            durchfuehrungsart: 'PRIVAT',
            jahr: 2026,
            kuerzel: 'P123456789',
        };

        beforeEach(async () => {
            fixture.componentRef.setInput('teilnahme', teilnahme);
            fixture.detectChanges();

            await fixture.whenStable();
        });

        it('should render the expected elements of a Privatteilnahme', () => {
            const subtitleDe = fixture.debugElement.query(By.css('.teilnahme-info__subtitle'));
            expect(subtitleDe.nativeElement.textContent.trim()).toBe('Privatteilnahme');
        });
    });
});
