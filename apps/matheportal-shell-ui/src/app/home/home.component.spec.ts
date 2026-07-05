import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { signal, WritableSignal } from '@angular/core';
import { anonymousUser, User } from '@matheportal/auth-model';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { By } from '@angular/platform-browser';
import { Mock } from 'vitest';

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    const activatedRouteStub: Partial<ActivatedRoute> = {};

    let authSessionFacadeMock: {
        validateSession: Mock<() => void>;
        isLoggedIn: WritableSignal<boolean>;
        user: WritableSignal<User>;
        isAdmin: WritableSignal<boolean>;
    };

    async function setup(user: User) {
        authSessionFacadeMock = {
            validateSession: vi.fn(),
            isAdmin: signal(user.berechtigungen.indexOf('ADMIN') > -1),
            isLoggedIn: signal(!user.anonym),
            user: signal(user),
        };

        await TestBed.configureTestingModule({
            imports: [HomeComponent, RouterModule.forRoot([{ path: '', component: AppComponent }])],
            providers: [
                { provide: ActivatedRoute, useFactory: () => activatedRouteStub },
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        await fixture.whenStable();
        fixture.detectChanges();
    }

    it('should show the public cards when not logged in', async () => {
        await setup(anonymousUser);
        expect(fixture).toBeTruthy();
        const cardsDe = fixture.debugElement.queryAll(By.css('.mp-home__card-link'));
        expect(cardsDe.length).toBe(2);

        const cardMinikaenguruDe = fixture.debugElement.query(By.css('.mp-home-card--minikaenguru'));
        expect(cardMinikaenguruDe).toBeTruthy();

        const cardRaetselbaukastenDe = fixture.debugElement.query(By.css('.mp-home-card--raetselbaukasten'));
        expect(cardRaetselbaukastenDe).toBeTruthy();

        const cardMinikaenguruAdminDe = fixture.debugElement.query(By.css('.mp-home-card--minikaenguru-admin'));
        expect(cardMinikaenguruAdminDe).toBeFalsy();
    });

    it.each(['STANDARD', 'SCHULE', 'PRIVAT', 'AUTOR'])(
        'should not show the card admin when logged in as &berechtigung',
        async berechtigung => {
            const berechtigungen = [];
            berechtigungen.push(berechtigung);
            await setup({
                anonym: false,
                fullName: 'Amy',
                berechtigungen: berechtigungen,
            });

            expect(fixture).toBeTruthy();
            const cardMinikaenguruAdminDe = fixture.debugElement.query(By.css('.mp-home-card--minikaenguru-admin'));
            expect(cardMinikaenguruAdminDe).toBeFalsy();
        }
    );

    it('should show the card ADMIN when logged in as ADMIN', async () => {
        await setup({
            anonym: false,
            fullName: 'Ruth',
            berechtigungen: ['ADMIN'],
        });

        const cardMinikaenguruAdminDe = fixture.debugElement.query(By.css('.mp-home-card--minikaenguru-admin'));
        expect(cardMinikaenguruAdminDe).toBeTruthy();
    });
});
