import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { anonymousUser, User } from '@matheportal/auth-model';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { computed } from '@angular/core';

describe('StartComponent', () => {
    let component: StartComponent;
    let fixture: ComponentFixture<StartComponent>;

    const activatedRouteMock = {};

    const authSessionFacadeMock = {
        validateSession: vi.fn(),
        isLoggedIn: computed(() => false),
        user: computed(() => anonymousUser),
    };

    const gast: User = anonymousUser;

    const loggedInUser: User = {
        // hier dein echter User-Teststub
        anonym: false,
        fullName: 'Ada Lovelace',
        berechtigungen: ['STANDARD'],
    } as User;

    async function setup(user: User) {
        authSessionFacadeMock.isLoggedIn = computed(() => !user.anonym);
        authSessionFacadeMock.user = computed(() => user);

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
            await setup(gast);
        });

        it('only shows guest-info when not logged in', () => {
            expect(fixture.debugElement.query(By.css('rbk-guest-info'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('rbk-dashboard'))).toBeFalsy();
        });
    });

    describe('logged in tests', () => {
        beforeEach(async () => {
            await setup(loggedInUser);
        });

        it('only shows dashboard when logged in', () => {
            expect(fixture.debugElement.query(By.css('rbk-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('rbk-dashboard'))).toBeTruthy();
        });
    });
});
