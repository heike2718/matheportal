import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { StartComponent } from './start.component';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { AuthorizationLoadState } from '../../core/authorization/authorization-model';

describe('StartComponent tests', () => {
    let fixture: ComponentFixture<StartComponent>;
    let authorizationLoadState$: BehaviorSubject<AuthorizationLoadState>;

    const mkaAuthorizationFacadeMock = {
        minikaenguruAufgerufen: vi.fn(),
    };

    const authSessionFacadeMock = {
        sessionLoadState: signal<RESOURCE_LOAD_STATE>('not-loaded'),
    };

    async function setup(
        sessionLoadState: RESOURCE_LOAD_STATE,
        authorizationLoadState: AuthorizationLoadState = 'not-loaded'
    ) {
        mkaAuthorizationFacadeMock.minikaenguruAufgerufen.mockClear();
        authSessionFacadeMock.sessionLoadState.set(sessionLoadState);
        authorizationLoadState$ = new BehaviorSubject<AuthorizationLoadState>(authorizationLoadState);

        await TestBed.configureTestingModule({
            imports: [StartComponent],
            providers: [
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
                {
                    provide: MkaAuthorizationFacade,
                    useValue: {
                        ...mkaAuthorizationFacadeMock,
                        authorizationLoadState$: authorizationLoadState$.asObservable(),
                    },
                },
            ],
        })
            .overrideComponent(StartComponent, {
                remove: { imports: [GuestInfoComponent] },
                add: { imports: [MockComponent(GuestInfoComponent)] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(StartComponent);
    }

    it('should request root entry once on initialization', async () => {
        await setup('loaded');

        fixture.detectChanges();
        fixture.detectChanges();

        expect(mkaAuthorizationFacadeMock.minikaenguruAufgerufen).toHaveBeenCalledTimes(1);
    });

    it('should show guest-info when session is unauthorized', async () => {
        await setup('unauthorized');

        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('.mka-start > p'))).toBeFalsy();
    });

    it.each(['not-loaded', 'loaded', 'technical-error'] as const)(
        'should not show guest-info when session is %s',
        async sessionLoadState => {
            await setup(sessionLoadState);

            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
        }
    );

    it.each(['not-loaded', 'loaded'] as const)(
        'should not show authorization error when authorization is %s',
        async authorizationLoadState => {
            await setup('loaded', authorizationLoadState);

            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('.mka-start > p'))).toBeFalsy();
        }
    );

    it('should show authorization error when authorization is already failed', async () => {
        await setup('loaded', 'failed');

        fixture.detectChanges();

        const message = fixture.debugElement.query(By.css('.mka-start > p'));

        expect(message).toBeTruthy();
        expect(message.nativeElement.textContent).toContain(
            'Ihre Minikänguru-Berechtigung konnte nicht geladen werden.'
        );
        expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
    });

    it('should show authorization error when loading fails after initialization', async () => {
        await setup('loaded');
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('.mka-start > p'))).toBeFalsy();

        authorizationLoadState$.next('failed');
        fixture.detectChanges();

        const message = fixture.debugElement.query(By.css('.mka-start > p'));

        expect(message).toBeTruthy();
        expect(message.nativeElement.textContent).toContain(
            'Ihre Minikänguru-Berechtigung konnte nicht geladen werden.'
        );
    });
});
