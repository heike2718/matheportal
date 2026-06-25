import { ReplaySubject, firstValueFrom, of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MkaAuthorizationEffects } from './mka-authorization.effects';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ERROR_PUBLISHER } from '@matheportal/error-handling-api';
import { User } from '@matheportal/auth-model';
import { fromMkaAuthorization } from './mka-authorization.selectors';
import { AuthorizationLoadState } from '../../authorization-model';
import { mkaAuthorizationActions } from './mka-authorization.actions';
import { MkaAuthorizationHttpService } from '../mka-authorization-http.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('MkaAuthorizationEffects tests', () => {
    let action$: ReplaySubject<unknown>;
    let effects: MkaAuthorizationEffects;
    let store: MockStore;

    const httpServiceMock = {
        loadMkaAuthorization: vi.fn(),
    };

    const errorPublisherMock = {
        publishWarning: vi.fn(),
        publishError: vi.fn(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new ReplaySubject<unknown>(1);

        TestBed.configureTestingModule({
            providers: [
                provideMockStore(),
                MkaAuthorizationEffects,
                provideMockActions(() => action$),
                {
                    provide: ERROR_PUBLISHER,
                    useValue: errorPublisherMock,
                },
                {
                    provide: MkaAuthorizationHttpService,
                    useValue: httpServiceMock,
                },
            ],
        });

        effects = TestBed.inject(MkaAuthorizationEffects);
        store = TestBed.inject(Store) as MockStore;
    });

    describe('loadMkaAuthorization$ tests', () => {
        it('should call the httpService and map to mkaAuthorizationLoaded when not-loaded and http request OK', async () => {
            const user: User = {
                anonym: false,
                fullName: 'Ada',
                berechtigungen: ['STANDARD'],
            };

            const authorizationLoadState: AuthorizationLoadState = 'not-loaded';

            store.overrideSelector(fromMkaAuthorization.authorizationLoadState, authorizationLoadState);
            store.refreshState();

            httpServiceMock.loadMkaAuthorization.mockReturnValue(of(user));

            action$.next(mkaAuthorizationActions.loadMkaAuthorization());
            const emmited = await firstValueFrom(effects.loadMkaAuthorization$);

            expect(emmited).toEqual(mkaAuthorizationActions.mkaAuthorizationLoaded({ user: user }));
            expect(httpServiceMock.loadMkaAuthorization).toHaveBeenCalledTimes(1);
        });

        it('should NOT call the httpService when loaded', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'loaded';
            store.overrideSelector(fromMkaAuthorization.authorizationLoadState, authorizationLoadState);
            store.refreshState();

            effects.loadMkaAuthorization$.subscribe({
                next: () => {
                    expect(true).toBeFalsy();
                },
                complete: () => {
                    expect(httpServiceMock.loadMkaAuthorization).not.toHaveBeenCalled();
                },
            });

            action$.next(mkaAuthorizationActions.loadMkaAuthorization());
            action$.complete();
        });

        it('should NOT call the httpService when failed', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'failed';
            store.overrideSelector(fromMkaAuthorization.authorizationLoadState, authorizationLoadState);
            store.refreshState();

            effects.loadMkaAuthorization$.subscribe({
                next: () => {
                    expect(true).toBeFalsy();
                },
                complete: () => {
                    expect(httpServiceMock.loadMkaAuthorization).not.toHaveBeenCalled();
                },
            });

            action$.next(mkaAuthorizationActions.loadMkaAuthorization());
            action$.complete();
        });

        it('should call httpService map to failed when returns HttpError', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'not-loaded';
            store.overrideSelector(fromMkaAuthorization.authorizationLoadState, authorizationLoadState);
            store.refreshState();

            const httpServerErrorResponse = new HttpErrorResponse({
                status: 500,
                statusText: 'Internal Server Error',
                error: 'boom',
                url: '/authurls/login',
            });

            httpServiceMock.loadMkaAuthorization.mockReturnValue(throwError(() => httpServerErrorResponse));

            action$.next(mkaAuthorizationActions.loadMkaAuthorization());
            const emmited = await firstValueFrom(effects.loadMkaAuthorization$);

            expect(emmited).toEqual(mkaAuthorizationActions.loadMkaAuthorizationFailed());
            expect(httpServiceMock.loadMkaAuthorization).toHaveBeenCalledTimes(1);
        });
    });

    describe('loadMkaAuthorizationFailed$ test', () => {
        it('publishes error when loadMkaAuthorizationFailed', async () => {
            action$.next(mkaAuthorizationActions.loadMkaAuthorizationFailed());
            await firstValueFrom(effects.loadMkaAuthorizationFailed$);

            expect(httpServiceMock.loadMkaAuthorization).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(errorPublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
            );
        });
    });
});
