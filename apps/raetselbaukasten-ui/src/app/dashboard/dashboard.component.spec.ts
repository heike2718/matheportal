import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Component, computed } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { anonymousUser, User } from '@matheportal/auth-model';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { By } from '@angular/platform-browser';
import { normalizeText } from '@matheportal/shared-testing';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    const standardUser: User = {
        anonym: false,
        fullName: 'Bilbo',
        berechtigungen: ['STANDARD'],
    };

    const autor: User = {
        anonym: false,
        fullName: 'Frodo',
        berechtigungen: ['AUTOR'],
    };

    const admin: User = {
        anonym: false,
        fullName: 'admin',
        berechtigungen: ['ADMIN'],
    };

    const activatedRouteMock = {};

    const authSessionFacadeMock = {
        user: computed(() => anonymousUser),
    };

    async function setup(user: User) {
        authSessionFacadeMock.user = computed(() => user);

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
                provideRouter([
                    { path: 'raetsel', component: DummyRouteComponent },
                    { path: 'aufgabensammlungen', component: DummyRouteComponent },
                    { path: 'medien', component: DummyRouteComponent },
                ]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    }

    describe('unauthorized', () => {
        beforeEach(async () => {
            await setup(anonymousUser);
        });

        it('should show text unauthorized', () => {
            fixture.detectChanges();

            const textDe = fixture.debugElement.query(By.css('[data-testid="unauthorized"]'));
            expect(textDe).toBeTruthy();

            const cardsStandardDe = fixture.debugElement.query(By.css('[data-testid="cards-standard"]'));
            expect(cardsStandardDe).toBeFalsy();

            const cardsAdminDe = fixture.debugElement.query(By.css('[data-testid="cards-autor-admin"]'));
            expect(cardsAdminDe).toBeFalsy();
        });
    });

    describe('standardUser', () => {
        beforeEach(async () => {
            await setup(standardUser);
        });

        it('should show 2 cards', () => {
            fixture.detectChanges();

            const cardsAdminDe = fixture.debugElement.query(By.css('[data-testid="cards-autor-admin"]'));
            expect(cardsAdminDe).toBeFalsy();

            const textDe = fixture.debugElement.query(By.css('[data-testid="unauthorized"]'));
            expect(textDe).toBeFalsy();

            const h2De = fixture.debugElement.query(By.css('h2'));
            expect(h2De).toBeFalsy();

            const standardCardsContainer = fixture.debugElement.query(By.css('[data-testid="cards-standard"]'));
            expect(standardCardsContainer).toBeTruthy();

            const titles = standardCardsContainer.queryAll(By.css('mat-card-title'));
            const contents = standardCardsContainer.queryAll(By.css('mat-card-content'));

            expect(titles).toHaveLength(2);
            expect(contents).toHaveLength(2);

            expect(titles[0].nativeElement.textContent.trim()).toBe('Aufgabensammlungen herunterladen');
            expect(titles[1].nativeElement.textContent.trim()).toBe('Rätsel suchen');

            expect(normalizeText(contents[0].nativeElement.textContent)).toBe(
                'Hier können Sie Aufgabensammlungen als Arbeitsblätter oder Knobelkarteien herunterladen.'
            );
            expect(normalizeText(contents[1].nativeElement.textContent)).toBe(
                'Hier können Sie nach Rätseln suchen. Es ist geplant, dass Sie eigene Aufgabensammlungen erstellen können. Aber diese Funktion ist noch nicht fertig.'
            );
        });
    });

    describe('autor', () => {
        beforeEach(async () => {
            await setup(autor);
        });

        it('should show 3 cards', () => {
            fixture.detectChanges();

            const textDe = fixture.debugElement.query(By.css('[data-testid="unauthorized"]'));
            expect(textDe).toBeFalsy();

            const standardCardsContainer = fixture.debugElement.query(By.css('[data-testid="cards-standard"]'));
            expect(standardCardsContainer).toBeFalsy();

            const h2De = fixture.debugElement.query(By.css('h2'));
            expect(h2De).toBeTruthy();
            expect(h2De.nativeElement.textContent.trim()).toBe('Autor');

            const autorCardsContainer = fixture.debugElement.query(By.css('[data-testid="cards-autor-admin"]'));
            expect(autorCardsContainer).toBeTruthy();

            const titles = autorCardsContainer.queryAll(By.css('mat-card-title'));
            const contents = autorCardsContainer.queryAll(By.css('mat-card-content'));

            expect(titles).toHaveLength(3);
            expect(contents).toHaveLength(3);

            expect(titles[0].nativeElement.textContent.trim()).toBe('Rätsel');
            expect(titles[1].nativeElement.textContent.trim()).toBe('Aufgabensammlungen');
            expect(titles[2].nativeElement.textContent.trim()).toBe('Medien');

            expect(normalizeText(contents[0].nativeElement.textContent)).toBe(
                'Hier können Sie Rätsel erstellen und publizieren.'
            );
            expect(normalizeText(contents[1].nativeElement.textContent)).toBe(
                'Hier können Sie Aufgabensammlungen zusammenstellen und publizieren.'
            );
            expect(normalizeText(contents[2].nativeElement.textContent)).toBe(
                'Hier können Sie Medien (Bücher, Zeitschriften, Internetseiten) erfassen, um sie als Rätsel zu zitieren oder in eigenen Rätseln zu adaptieren.'
            );
        });
    });

    describe('admin', () => {
        beforeEach(async () => {
            await setup(admin);
        });

        it('should show 3 cards', () => {
            fixture.detectChanges();

            const textDe = fixture.debugElement.query(By.css('[data-testid="unauthorized"]'));
            expect(textDe).toBeFalsy();

            const standardCardsContainer = fixture.debugElement.query(By.css('[data-testid="cards-standard"]'));
            expect(standardCardsContainer).toBeFalsy();

            const h2De = fixture.debugElement.query(By.css('h2'));
            expect(h2De).toBeTruthy();
            expect(h2De.nativeElement.textContent.trim()).toBe('Administrator');

            const autorCardsContainer = fixture.debugElement.query(By.css('[data-testid="cards-autor-admin"]'));
            expect(autorCardsContainer).toBeTruthy();

            const titles = autorCardsContainer.queryAll(By.css('mat-card-title'));
            const contents = autorCardsContainer.queryAll(By.css('mat-card-content'));

            expect(titles).toHaveLength(3);
            expect(contents).toHaveLength(3);

            expect(titles[0].nativeElement.textContent.trim()).toBe('Rätsel');
            expect(titles[1].nativeElement.textContent.trim()).toBe('Aufgabensammlungen');
            expect(titles[2].nativeElement.textContent.trim()).toBe('Medien');

            expect(normalizeText(contents[0].nativeElement.textContent)).toBe(
                'Hier können Sie Rätsel erstellen und publizieren.'
            );
            expect(normalizeText(contents[1].nativeElement.textContent)).toBe(
                'Hier können Sie Aufgabensammlungen zusammenstellen und publizieren.'
            );
            expect(normalizeText(contents[2].nativeElement.textContent)).toBe(
                'Hier können Sie Medien (Bücher, Zeitschriften, Internetseiten) erfassen, um sie als Rätsel zu zitieren oder in eigenen Rätseln zu adaptieren.'
            );
        });
    });
});

@Component({
    standalone: true,
    template: '',
})
class DummyRouteComponent {}
