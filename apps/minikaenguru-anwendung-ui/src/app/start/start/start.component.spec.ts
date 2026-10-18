import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { By } from '@angular/platform-browser';
import { computed } from '@angular/core';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { StartViewState } from '../../core/authorization/authorization-model';
import { anonymousUser } from '@matheportal/auth-model';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { DurchfuehrungsartWaehlenComponent } from '../durchfuehrungsart-waehlen/durchfuehrungsart-waehlen.component';
import { MockComponent } from 'ng-mocks';

describe('StartComponent tests', () => {
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
            ],
        })
            .overrideComponent(DurchfuehrungsartWaehlenComponent, {
                remove: { imports: [DurchfuehrungsartWaehlenComponent] },
                add: { imports: [MockComponent(DurchfuehrungsartWaehlenComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(StartComponent);
    }

    describe('logged out tests', () => {
        beforeEach(async () => await setup('guest'));

        it('shows guest-info when guest', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-loading"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-authorization-failed"]'))).toBeFalsy();
        });
    });

    describe('loading tests', () => {
        beforeEach(async () => await setup('loading'));
        it('shows loading when loading', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-loading"]'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-authorization-failed"]'))).toBeFalsy();
        });
    });

    describe('augmentation failed tests', () => {
        beforeEach(async () => setup('failed'));
        it('shows failed when failed', () => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-loading"]'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-authorization-failed"]'))).toBeTruthy();
        });
    });
});
