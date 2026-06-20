import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { anonymousUser, User } from '@matheportal/auth-model';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

describe('StartComponent', () => {
    let component: StartComponent;
    let fixture: ComponentFixture<StartComponent>;

    let hasSessionSubject: BehaviorSubject<boolean>;
    let userSubject: BehaviorSubject<User>;

    const activatedRouteMock = {};

    const authSessionFacadeMock = {
        validateSession: vi.fn(),
        hasSession$: undefined as unknown as Observable<boolean>,
        user$: undefined as unknown as Observable<User>,
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
            imports: [StartComponent],
            providers: [
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
    }

    beforeEach(async () => {
        vi.clearAllMocks();
        TestBed.resetTestingModule();
    });

    describe('logged out tests', () => {
        beforeEach(async () => {
            await setup({
                user: gast,
                hasSession: false,
            });
        });

        it('only shows guest-info when not logged in', () => {
            expect(fixture.debugElement.query(By.css('rbk-guest-info'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('rbk-dashboard'))).toBeFalsy();
        });
    });

    describe('logged in tests', () => {
        beforeEach(async () => {
            await setup({
                user: loggedInUser,
                hasSession: true,
            });
        });

        it('only shows dashboard when logged in', () => {
            expect(fixture.debugElement.query(By.css('rbk-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('rbk-dashboard'))).toBeTruthy();
        });
    });
});
