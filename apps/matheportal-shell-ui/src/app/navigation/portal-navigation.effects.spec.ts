import { sessionValidationFailed, userLoggedOut } from '@matheportal/auth-api';
import { PortalNavigationEffects } from './portal-navigation.effects';
import { firstValueFrom, Subject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { Action, provideStore } from '@ngrx/store';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Router } from '@angular/router';

describe('PortalNavigationEffects tests', () => {
    let action$: Subject<Action>;
    let effects: PortalNavigationEffects;

    const expectedTechnicalErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    const messagePublisherMock = {
        publishInfo: vi.fn(),
        publishWarning: vi.fn(),
        publishError: vi.fn(),
    };

    const routerMock = {
        navigate: vi.fn(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        TestBed.configureTestingModule({
            providers: [
                provideStore(),
                PortalNavigationEffects,
                { provide: Router, useValue: routerMock },
                provideMockActions(() => action$),
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
            ],
        });

        effects = TestBed.inject(PortalNavigationEffects);
    });

    describe('sessionValidationFailed$', () => {
        it('should show warning when session validation failed with expired and redirect to home', async () => {
            const promise = firstValueFrom(effects.sessionValidationFailed$);

            action$.next(sessionValidationFailed({ reason: 'expired' }));
            await promise;

            expect(messagePublisherMock.publishWarning).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishWarning).toHaveBeenCalledWith(
                'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
            );

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'home']);
        });

        it('should show nothing when session validation failed with missing, and redirect to home', async () => {
            const promise = firstValueFrom(effects.sessionValidationFailed$);
            action$.next(sessionValidationFailed({ reason: 'missing' }));
            await promise;
            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'home']);
        });

        it('should show error when session validation failed with technical and redirect to home', async () => {
            const promise = firstValueFrom(effects.sessionValidationFailed$);

            action$.next(sessionValidationFailed({ reason: 'technical' }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'home']);
        });
    });

    describe('userLoggedOut$', () => {
        it('should navigate to home', async () => {
            const promise = firstValueFrom(effects.userLoggedOut$);

            action$.next(userLoggedOut);
            await promise;

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'home']);
        });
    });
});
