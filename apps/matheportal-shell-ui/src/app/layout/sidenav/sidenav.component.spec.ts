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

    let isSessionValidatedSubject: BehaviorSubject<boolean>;
    let userSubject: BehaviorSubject<User>;

    const authSessionFacadeMock = {
        validateSession: vi.fn(),
        isSessionValidated$: undefined as unknown as Observable<boolean>,
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

    async function setup(options?: { user?: User; isSessionValidated?: boolean }) {
        isSessionValidatedSubject = new BehaviorSubject<boolean>(options?.isSessionValidated ?? false);
        userSubject = new BehaviorSubject<User>(options?.user ?? gast);

        authSessionFacadeMock.isSessionValidated$ = isSessionValidatedSubject.asObservable();
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
                isSessionValidated: false,
            });
        });

        it('should show a navigation list', () => {
            fixture.detectChanges();

            const mainLinksDe = fixture.debugElement.query(By.css('[data-testid="sidenav-main-links"]'));
            expect(mainLinksDe).toBeTruthy();

            const portalLinkDe = fixture.debugElement.query(By.css('.sidenav__link--portal'));
            expect(portalLinkDe).toBeTruthy();
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
                isSessionValidated: false,
            });
        });
        it('it should show login button and call login when login is clicked', () => {
            fixture.detectChanges();

            const authButtonDe = fixture.debugElement.query(By.css('.sidenav__auth-btn'));
            const auhtIcon = authButtonDe.query(By.css('.sidenav__icon'));
            const authTextDe = authButtonDe.query(By.css('[data-testid="sidenav-auth-btn-label"]'));

            expect(authButtonDe).toBeTruthy();
            expect(auhtIcon).toBeTruthy();
            expect(auhtIcon.nativeElement.textContent.trim()).toBe('login');
            expect(authTextDe.nativeElement.textContent.trim()).toBe('Login');

            authButtonDe.triggerEventHandler('click');

            expect(authFlowFacadeMock.login).toHaveBeenCalledOnce();
            expect(authFlowFacadeMock.logout).not.toHaveBeenCalled();
        });
    });

    describe('logged in', () => {
        beforeEach(async () => {
            await setup({
                user: loggedInUser,
                isSessionValidated: true,
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
            expect(authTextDe.nativeElement.textContent.trim()).toBe('Logout');

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
