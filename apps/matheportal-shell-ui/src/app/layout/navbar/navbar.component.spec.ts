import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockRuntimeConfig } from '@matheportal/shared-testing';
import { NavbarComponent } from './navbar.component';
import { HomeComponent } from '../../home/home.component';
import { MATHEPORTAL_SHELL_CONFIGURATION } from '../../config/matheportal-shell.configuration';
import { Component, computed } from '@angular/core';
import { AuthFlowFacade, AuthSessionFacade } from '@matheportal/auth-api';
import { anonymousUser, User } from '@matheportal/auth-model';

describe('NavbarComponent', () => {
    let fixture: ComponentFixture<NavbarComponent>;
    let component: NavbarComponent;

    const authSessionFacadeMock = {
        validateSession: vi.fn(),
        isLoggedIn: computed(() => false),
        user: computed(() => anonymousUser),
    };

    const authFlowFacadeMock = {
        login: vi.fn(),
        signup: vi.fn(),
        logout: vi.fn(),
    };

    const gast: User = anonymousUser;

    const loggedInUser: User = {
        // hier dein echter User-Teststub
        anonym: false,
        fullName: 'Ada Lovelace',
        berechtigungen: ['STANDARD'],
    } as User;

    async function setup(isHandset: boolean, user: User) {
        authSessionFacadeMock.isLoggedIn = computed(() => !user.anonym);
        authSessionFacadeMock.user = computed(() => user);

        await TestBed.configureTestingModule({
            imports: [NavbarComponent],
            providers: [
                {
                    provide: MATHEPORTAL_SHELL_CONFIGURATION,
                    useValue: { ...mockRuntimeConfig, apiUrl: '' },
                },
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
                { provide: AuthFlowFacade, useValue: authFlowFacadeMock },
                provideRouter([
                    { path: 'home', component: HomeComponent },
                    { path: 'minikaenguru-anwendung', component: DummyRouteComponent },
                    { path: 'raetselbaukasten', component: DummyRouteComponent },
                ]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;

        component.isHandset = computed(() => isHandset);

        fixture.detectChanges();
    }

    beforeEach(() => {
        vi.clearAllMocks();
        TestBed.resetTestingModule();
    });

    describe('NavbarComponent not handset', () => {
        beforeEach(async () => {
            await setup(false, gast);
        });
        it('should show desktop navigation links when not on handset', () => {
            const linksDe = fixture.debugElement.query(By.css('.nav__links'));
            expect(linksDe).toBeTruthy();

            const menuButtonDe = fixture.debugElement.query(By.css('.nav__menu-btn'));
            expect(menuButtonDe).toBeNull();

            const portalLinkDe = fixture.debugElement.query(By.css('.nav__link--portal'));
            const minikaenguruLinkDe = fixture.debugElement.query(By.css('.nav__link--minikaenguru'));
            const raetselbaukastenLinkDe = fixture.debugElement.query(By.css('.nav__link--raetselbaukasten'));

            const portalIcon = portalLinkDe.query(By.css('.nav__icon'));
            expect(portalIcon.nativeElement.textContent.trim()).toBe('home');

            const portalText = portalLinkDe.query(By.css('.nav__caption'));
            expect(portalText.nativeElement.textContent.trim()).toBe('Matheportal');

            const minikaenguruIcon = minikaenguruLinkDe.query(By.css('.nav__icon'));
            expect(minikaenguruIcon.nativeElement.textContent.trim()).toBe('school');

            const minikaenguruText = minikaenguruLinkDe.query(By.css('.nav__caption'));
            expect(minikaenguruText.nativeElement.textContent.trim()).toBe('Minikänguru');

            const raetselbaukastenIcon = raetselbaukastenLinkDe.query(By.css('.nav__icon'));
            expect(raetselbaukastenIcon.nativeElement.textContent.trim()).toBe('extension');

            const raetselbaukastenText = raetselbaukastenLinkDe.query(By.css('.nav__caption'));
            expect(raetselbaukastenText.nativeElement.textContent.trim()).toBe('Rätselbaukasten');

            expect(portalLinkDe).toBeTruthy();
            expect(minikaenguruLinkDe).toBeTruthy();
            expect(raetselbaukastenLinkDe).toBeTruthy();
        });
    });

    describe('NavbarComponent not handset and logged out', () => {
        beforeEach(async () => {
            await setup(false, gast);
        });
        it('should show anonymous greeting', () => {
            fixture.detectChanges();

            const greetingDe = fixture.debugElement.query(By.css('.nav__greeting'));

            expect(greetingDe).toBeTruthy();
            expect(greetingDe.nativeElement.textContent.trim()).toBe('Hallo, Gast');
        });
        it('it should show login button and signup button and call the expected method when clicked', () => {
            fixture.detectChanges();

            const authButtonsDe = fixture.debugElement.queryAll(By.css('.nav__auth-btn'));

            expect(authButtonsDe).toBeTruthy();
            expect(authButtonsDe.length).toBe(2);

            const loginButtonDe = authButtonsDe[0];
            const loginIcon = loginButtonDe.query(By.css('.nav__icon'));
            const loginText = loginButtonDe.query(By.css('[data-testid="navbar-auth-btn-label"]'));
            expect(loginText.nativeElement.textContent.trim()).toBe('einloggen');
            expect(loginIcon.nativeElement.textContent.trim()).toBe('login');

            const signupButtonDe = authButtonsDe[1];
            const signupIcon = signupButtonDe.query(By.css('.nav__icon'));
            const signupText = signupButtonDe.query(By.css('[data-testid="navbar-auth-btn-label"]'));
            expect(signupIcon.nativeElement.textContent.trim()).toBe('person_add');
            expect(signupText.nativeElement.textContent.trim()).toBe('registrieren');
        });

        it('it should call login when login is clicked', () => {
            fixture.detectChanges();

            const authButtonsDe = fixture.debugElement.queryAll(By.css('.nav__auth-btn'));

            expect(authButtonsDe).toBeTruthy();
            expect(authButtonsDe.length).toBe(2);

            const loginButtonDe = authButtonsDe[0];
            loginButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.login).toHaveBeenCalledOnce();
            expect(authFlowFacadeMock.signup).not.toHaveBeenCalled();
            expect(authFlowFacadeMock.logout).not.toHaveBeenCalled();
        });
        it('it should call signup when sihup is clicked', () => {
            fixture.detectChanges();

            const authButtonsDe = fixture.debugElement.queryAll(By.css('.nav__auth-btn'));

            expect(authButtonsDe).toBeTruthy();
            expect(authButtonsDe.length).toBe(2);

            const signupButtonDe = authButtonsDe[1];
            signupButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.login).not.toHaveBeenCalled();
            expect(authFlowFacadeMock.signup).toHaveBeenCalledOnce();
            expect(authFlowFacadeMock.logout).not.toHaveBeenCalled();
        });
    });

    describe('Navbarcomponent not handset and logged in', () => {
        beforeEach(async () => {
            await setup(false, loggedInUser);
        });

        it('should show personalized greeting', () => {
            fixture.detectChanges();

            const greetingDe = fixture.debugElement.query(By.css('.nav__greeting'));

            expect(greetingDe).toBeTruthy();
            expect(greetingDe.nativeElement.textContent.trim()).toBe('Hallo, Ada Lovelace');
        });

        it('should show logout button and call logout when logout is clicked', () => {
            fixture.detectChanges();

            const logoutButtonDe = fixture.debugElement.query(By.css('.nav__auth-btn'));
            const logoutIcon = logoutButtonDe.query(By.css('.nav__icon'));
            const logoutText = logoutButtonDe.query(By.css('[data-testid="navbar-auth-btn-label"]'));
            expect(logoutIcon.nativeElement.textContent.trim()).toBe('logout');
            expect(logoutText.nativeElement.textContent.trim()).toBe('abmelden');

            logoutButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.logout).toHaveBeenCalledOnce();
            expect(authFlowFacadeMock.signup).not.toHaveBeenCalled();
            expect(authFlowFacadeMock.login).not.toHaveBeenCalled();
        });
    });

    describe('NavbarComponent handset', () => {
        beforeEach(async () => {
            await setup(true, gast);
        });
        it('should show hamburger menu button on handset', () => {
            fixture.detectChanges();

            const buttonDe = fixture.debugElement.query(By.css('.nav__menu-btn'));
            expect(buttonDe).toBeTruthy();

            const linksDe = fixture.debugElement.query(By.css('.nav__links'));
            expect(linksDe).toBeNull();
        });

        it('should emit sidenavToggle when hamburger menu button is clicked', () => {
            const spy = vi.spyOn(component.sidenavToggle, 'emit');

            fixture.detectChanges();

            const buttonDe = fixture.debugElement.query(By.css('.nav__menu-btn'));
            expect(buttonDe).toBeTruthy();

            buttonDe.nativeElement.click();

            expect(spy).toHaveBeenCalledOnce();
        });
    });
});

@Component({
    standalone: true,
    template: '',
})
class DummyRouteComponent {}
