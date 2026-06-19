import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockRuntimeConfig } from '@matheportal/shared-testing';
import { NavbarComponent } from './navbar.component';
import { HomeComponent } from '../../home/home.component';
import { MATHEPORTAL_SHELL_CONFIGURATION } from '../../config/matheportal-shell.configuration';
import { Component } from '@angular/core';
import { AuthFlowFacade, AuthSessionFacade } from '@matheportal/auth-api';
import { anonymousUser, User } from '@matheportal/auth-model';

describe('NavbarComponent', () => {
    let fixture: ComponentFixture<NavbarComponent>;
    let component: NavbarComponent;

    let hasSessionSubject: BehaviorSubject<boolean>;
    let userSubject: BehaviorSubject<User>;

    const authSessionFacadeMock = {
        validateSession: vi.fn(),
        hasSession$: undefined as unknown as Observable<boolean>,
        user$: undefined as unknown as Observable<User>,
    };
    const authFlowFacadeMock = {
        login: vi.fn(),
        logout: vi.fn(),
    };

    const gast: User = anonymousUser;

    const loggedInUser: User = {
        // hier dein echter User-Teststub
        anonym: false,
        fullName: 'Ada Lovelace',
        roles: ['STANDARD'],
    } as User;

    async function setup(options?: { isHandset?: boolean; user?: User; hasSession?: boolean }) {
        hasSessionSubject = new BehaviorSubject<boolean>(options?.hasSession ?? false);
        userSubject = new BehaviorSubject<User>(options?.user ?? gast);

        authSessionFacadeMock.hasSession$ = hasSessionSubject.asObservable();
        authSessionFacadeMock.user$ = userSubject.asObservable();

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

        component.isHandset$ = of(options?.isHandset ?? false);

        fixture.detectChanges();
    }

    beforeEach(() => {
        vi.clearAllMocks();
        TestBed.resetTestingModule();
    });

    describe('NavbarComponent not handset', () => {
        beforeEach(async () => {
            await setup({ isHandset: false });
        });
        it('should show desktop navigation links when not on handset', () => {
            const linksDe = fixture.debugElement.query(By.css('.nav__links'));
            expect(linksDe).toBeTruthy();

            const menuButtonDe = fixture.debugElement.query(By.css('.nav__menu-btn'));
            expect(menuButtonDe).toBeNull();

            const portalLinkDe = fixture.debugElement.query(By.css('.nav__link--portal'));
            const minikaenguruLinkDe = fixture.debugElement.query(By.css('.nav__link--minikaenguru'));
            const raetselbaukastenLinkDe = fixture.debugElement.query(By.css('.nav__link--raetselbaukasten'));

            expect(portalLinkDe).toBeTruthy();
            expect(minikaenguruLinkDe).toBeTruthy();
            expect(raetselbaukastenLinkDe).toBeTruthy();
        });
    });

    describe('NavbarComponent not handset and logged out', () => {
        beforeEach(async () => {
            await setup({
                isHandset: false,
                user: gast,
                hasSession: false,
            });
        });
        it('should show anonymous greeting', () => {
            fixture.detectChanges();

            const greetingDe = fixture.debugElement.query(By.css('.nav__greeting'));

            expect(greetingDe).toBeTruthy();
            expect(greetingDe.nativeElement.textContent.trim()).toBe('Hallo, Gast');
        });
        it('it should show login button and call login when login is clicked', () => {
            fixture.detectChanges();

            const authButtonDe = fixture.debugElement.query(By.css('.nav__auth-btn'));

            expect(authButtonDe).toBeTruthy();
            expect(authButtonDe.nativeElement.textContent.trim()).toBe('Login');

            authButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.login).toHaveBeenCalledOnce();
            expect(authFlowFacadeMock.logout).not.toHaveBeenCalled();
        });
    });

    describe('Navbarcomponent not handset and logged in', () => {
        beforeEach(async () => {
            await setup({
                isHandset: false,
                user: loggedInUser,
                hasSession: true,
            });
        });

        it('should show personalized greeting', () => {
            fixture.detectChanges();

            const greetingDe = fixture.debugElement.query(By.css('.nav__greeting'));

            expect(greetingDe).toBeTruthy();
            expect(greetingDe.nativeElement.textContent.trim()).toBe('Hallo, Ada Lovelace');
        });

        it('should show logout button and call logout when logout is clicked', () => {
            fixture.detectChanges();

            const authButtonDe = fixture.debugElement.query(By.css('.nav__auth-btn'));

            expect(authButtonDe).toBeTruthy();
            expect(authButtonDe.nativeElement.textContent.trim()).toBe('Logout');

            authButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.logout).toHaveBeenCalledOnce();
            expect(authFlowFacadeMock.login).not.toHaveBeenCalled();
        });
    });

    describe('NavbarComponent handset', () => {
        beforeEach(async () => {
            await setup({ isHandset: true });
        });
        it('should show hamburger menu button on handset', () => {
            component.isHandset$ = of(true);
            fixture.detectChanges();

            const buttonDe = fixture.debugElement.query(By.css('.nav__menu-btn'));
            expect(buttonDe).toBeTruthy();

            const linksDe = fixture.debugElement.query(By.css('.nav__links'));
            expect(linksDe).toBeNull();
        });

        it('should emit sidenavToggle when hamburger menu button is clicked', () => {
            const spy = vi.spyOn(component.sidenavToggle, 'emit');

            component.isHandset$ = of(true);
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
