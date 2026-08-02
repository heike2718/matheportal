import { sessionValidationFailed, userLoggedOut } from '@matheportal/auth-api';
import { PortalNavigationEffects } from './portal-navigation.effects';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Router } from '@angular/router';

// expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
describe('PortalNavigationEffects tests', () => {
    let action$: ReplaySubject<unknown>;
    let effects: PortalNavigationEffects;

    const expectedTechnicalErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    const messagePublisherMock = {
        publishInfo: vi.fn(),
        publishWarning: vi.fn(),
        publishError: vi.fn(),
    };

    const routerMock = {
        navigateByUrl: vi.fn(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new ReplaySubject<unknown>(1);

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
            action$.next(sessionValidationFailed({ reason: 'expired' }));
            await firstValueFrom(effects.sessionValidationFailed$);
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishWarning).toHaveBeenCalledWith(
                'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
            );
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
        });

        it('should show nothing when session validation failed with missing, but not redirect to home', async () => {
            action$.next(sessionValidationFailed({ reason: 'missing' }));
            await firstValueFrom(effects.sessionValidationFailed$);
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
        });

        it('should show error when session validation failed with technical and redirect to home', async () => {
            action$.next(sessionValidationFailed({ reason: 'technical' }));
            await firstValueFrom(effects.sessionValidationFailed$);

            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
        });
    });

    describe('userLoggedOut$', () => {
        it('should navigate to home', async () => {
            action$.next(userLoggedOut);
            await firstValueFrom(effects.userLoggedOut$);

            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
        });
    });
});
