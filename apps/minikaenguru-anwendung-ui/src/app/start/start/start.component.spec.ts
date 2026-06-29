import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { By } from '@angular/platform-browser';
import { Component, computed } from '@angular/core';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { StartViewState } from '../../core/authorization/authorization-model';
import { provideRouter } from '@angular/router';
import { anonymousUser } from '@matheportal/auth-model';
import { AuthSessionFacade } from '@matheportal/auth-api';

describe('StartComponent tests', () => {
    let component: StartComponent;
    let fixture: ComponentFixture<StartComponent>;

    const mkaAuthorizationFacadeMock = {
        startViewState: computed(() => 'guest'),
        ensureAuthorizationLoaded: vi.fn(),
    };

    const authSessionFacadeMock = {
        user: computed(() => anonymousUser),
        isLoggedIn: computed(() => false),
    };

    async function setup(startViewState: StartViewState) {
        mkaAuthorizationFacadeMock.startViewState = computed(() => startViewState);
        await TestBed.configureTestingModule({
            imports: [StartComponent],
            providers: [
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
                { provide: MkaAuthorizationFacade, useValue: mkaAuthorizationFacadeMock },
                provideRouter([{ path: 'minikaenguru-anwendung/guest', component: DummyRouteComponent }]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartComponent);
        component = fixture.componentInstance;
    }

    describe('logged out tests', () => {
        beforeEach(async () => await setup('guest'));

        it('shows guest-info when guest', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privatperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-loading"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-authorization-failed"]'))).toBeFalsy();
        });
    });

    describe('loading tests', () => {
        beforeEach(async () => await setup('loading'));
        it('shows loading when loading', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privatperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-loading"]'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-authorization-failed"]'))).toBeFalsy();
        });
    });

    describe('augmentation failed tests', () => {
        beforeEach(async () => setup('failed'));
        it('shows failed when failed', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privatperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-loading"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-authorization-failed"]'))).toBeTruthy();
        });
    });

    describe('standard user tests', () => {
        beforeEach(async () => setup('wettbewerbsdurchfuehrenden-anlegen'));
        it('shows mka-standarduser when veranstalter-anlegen', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privatperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-loading"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-authorization-failed"]'))).toBeFalsy();
        });
    });

    describe('lehrer tests', () => {
        beforeEach(async () => setup('dashboard-lehrperson'));
        it('shows dashboard-lehrperson when dashboard-lehrperson', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrperson'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privatperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-loading"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-authorization-failed"]'))).toBeFalsy();
        });
    });

    describe('privatveranstalter tests', () => {
        beforeEach(async () => setup('dashboard-privatperson'));
        it('shows dashboard-privatperson when dashboard-privatperson', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrperson'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privatperson'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-loading"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-authorization-failed"]'))).toBeFalsy();
        });
    });
});

@Component({
    standalone: true,
    template: '',
})
class DummyRouteComponent {}
