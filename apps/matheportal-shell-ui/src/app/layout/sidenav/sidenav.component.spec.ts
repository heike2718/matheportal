import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidenavComponent } from './sidenav.component';
import { mockRuntimeConfig } from '@matheportal/shared-testing';
import { MATHEPORTAL_SHELL_CONFIGURATION } from '../../config/matheportal-shell.configuration';
import { HomeComponent } from '../../home/home.component';
import { AuthFlowFacade, AuthSessionFacade } from '@matheportal/auth-api';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { anonymousUser, User } from '@matheportal/auth-model';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;

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
        signup: vi.fn(),
    };

    const gast: User = anonymousUser;

    const loggedInUser: User = {
        // hier dein echter User-Teststub
        anonym: false,
        fullName: 'Ada Lovelace',
        berechtigungen: ['STANDARD'],
    } as User;

    async function setup(options?: { user?: User; hasSession?: boolean }) {
        hasSessionSubject = new BehaviorSubject<boolean>(options?.hasSession ?? false);
        userSubject = new BehaviorSubject<User>(options?.user ?? gast);

        authSessionFacadeMock.hasSession$ = hasSessionSubject.asObservable();
        authSessionFacadeMock.user$ = userSubject.asObservable();

        await TestBed.configureTestingModule({
            imports: [SidenavComponent],
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

        fixture = TestBed.createComponent(SidenavComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }

    beforeEach(() => {
        vi.clearAllMocks();
        TestBed.resetTestingModule();
    });

    describe('general tests', () => {
        beforeEach(async () => {
            await setup({
                user: gast,
                hasSession: false,
            });
        });

        it('should show a navigation list', () => {
            fixture.detectChanges();

            const mainLinksDe = fixture.debugElement.query(By.css('[data-testid="sidenav-main-links"]'));
            expect(mainLinksDe).toBeTruthy();

            const portalLinkDe = fixture.debugElement.query(By.css('.sidenav__link--portal'));
            expect(portalLinkDe).toBeTruthy();

            const minikaenguruLinkDe = fixture.debugElement.query(By.css('.sidenav__link--minikaenguru'));
            expect(minikaenguruLinkDe).toBeTruthy();

            const raetselbaukastenLinkDe = fixture.debugElement.query(By.css('.sidenav__link--raetselbaukasten'));
            expect(raetselbaukastenLinkDe).toBeTruthy();
        });

        it('should show the datenschutz-Link', () => {
            fixture.detectChanges();

            const datenschutzLinkDe = fixture.debugElement.query(By.css('.sidenav__secondary-link'));
            expect(datenschutzLinkDe).toBeTruthy();

            expect(datenschutzLinkDe.nativeElement.getAttribute('href')).toBe(
                'https://mathe-jung-alt.de/datenschutz.html'
            );
        });
    });

    describe('logged out', () => {
        beforeEach(async () => {
            await setup({
                user: gast,
                hasSession: false,
            });
        });
        it('it should show login and signup buttons', () => {
            fixture.detectChanges();

            const authButtonsDe = fixture.debugElement.queryAll(By.css('.sidenav__auth-btn'));

            expect(authButtonsDe).toBeTruthy();
            expect(authButtonsDe.length).toBe(2);

            const loginButtonDe = authButtonsDe[0];
            const loginIcon = loginButtonDe.query(By.css('.sidenav__icon'));
            const loginText = loginButtonDe.query(By.css('[data-testid="sidenav-auth-btn-label"]'));

            expect(loginIcon.nativeElement.textContent.trim()).toBe('login');
            expect(loginText.nativeElement.textContent.trim()).toBe('einloggen');

            loginButtonDe.triggerEventHandler('click');

            const signupButtonDe = authButtonsDe[1];
            const signupIcon = signupButtonDe.query(By.css('.sidenav__icon'));
            const signupText = signupButtonDe.query(By.css('[data-testid="sidenav-auth-btn-label"]'));

            expect(signupIcon.nativeElement.textContent.trim()).toBe('person_add');
            expect(signupText.nativeElement.textContent.trim()).toBe('registrieren');

            signupButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.login).toHaveBeenCalledOnce(); // vom ersten click
            expect(authFlowFacadeMock.logout).not.toHaveBeenCalled();
            expect(authFlowFacadeMock.signup).toHaveBeenCalledOnce(); // vom zweiten click
        });

        it('it should call login when login is clicked', () => {
            fixture.detectChanges();

            const authButtonsDe = fixture.debugElement.queryAll(By.css('.sidenav__auth-btn'));

            expect(authButtonsDe).toBeTruthy();
            expect(authButtonsDe.length).toBe(2);

            const loginButtonDe = authButtonsDe[0];

            loginButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.login).toHaveBeenCalledOnce();
            expect(authFlowFacadeMock.logout).not.toHaveBeenCalled();
            expect(authFlowFacadeMock.signup).not.toHaveBeenCalled();
        });

        it('it should call signup when signup is clicked', () => {
            fixture.detectChanges();

            const authButtonsDe = fixture.debugElement.queryAll(By.css('.sidenav__auth-btn'));

            expect(authButtonsDe).toBeTruthy();
            expect(authButtonsDe.length).toBe(2);

            const signupButtonDe = authButtonsDe[1];

            signupButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.login).not.toHaveBeenCalled();
            expect(authFlowFacadeMock.logout).not.toHaveBeenCalled();
            expect(authFlowFacadeMock.signup).toHaveBeenCalledOnce();
        });
    });

    describe('logged in', () => {
        beforeEach(async () => {
            await setup({
                user: loggedInUser,
                hasSession: true,
            });
        });
        it('it should show logout button and call logout when logout is clicked', () => {
            fixture.detectChanges();

            const authButtonDe = fixture.debugElement.query(By.css('.sidenav__auth-btn'));
            const auhtIcon = authButtonDe.query(By.css('.sidenav__icon'));
            const authTextDe = authButtonDe.query(By.css('[data-testid="sidenav-auth-btn-label"]'));

            expect(authButtonDe).toBeTruthy();
            expect(auhtIcon).toBeTruthy();
            expect(auhtIcon.nativeElement.textContent.trim()).toBe('logout');
            expect(authTextDe.nativeElement.textContent.trim()).toBe('abmelden');

            authButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.logout).toHaveBeenCalledOnce();
            expect(authFlowFacadeMock.login).not.toHaveBeenCalled();
        });
    });
});

@Component({
    standalone: true,
    template: '',
})
class DummyRouteComponent {}
