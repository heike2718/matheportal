import { Subject, firstValueFrom, of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MkaAuthorizationEffects } from './mka-authorization.effects';
import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { User } from '@matheportal/auth-model';
import { fromMkaAuthorization } from './mka-authorization.selectors';
import { AuthorizationLoadState } from '../../authorization-model';
import { mkaAuthorizationActions } from './mka-authorization.actions';
import { MkaAuthorizationHttpService } from '../mka-authorization-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthSessionFacade, sessionState } from '@matheportal/auth-api';

describe('MkaAuthorizationEffects tests', () => {
    let action$: Subject<Action>;
    let effects: MkaAuthorizationEffects;
    let store: MockStore;

    const httpServiceMock = {
        loadMkaAuthorization: vi.fn(),
    };

    const messagePublisherMock = {
        publishWarning: vi.fn(),
        publishError: vi.fn(),
    };

    const authSessionFacadeMock = {
        synchronizeUser: vi.fn(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        TestBed.configureTestingModule({
            providers: [
                provideMockStore(),
                MkaAuthorizationEffects,
                provideMockActions(() => action$),
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
                {
                    provide: AuthSessionFacade,
                    useValue: authSessionFacadeMock,
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

    describe('ensureMkaAuthorizationLoaded$', () => {
        it('should map to loadMkaAuthorization when the session is already loaded', async () => {
            store.overrideSelector(sessionState, 'loaded');
            store.refreshState();

            const promise = firstValueFrom(effects.ensureMkaAuthorizationLoaded$);

            action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

            const emitted = await promise;

            expect(emitted).toEqual(mkaAuthorizationActions.loadMkaAuthorization());
            expect(httpServiceMock.loadMkaAuthorization).not.toHaveBeenCalled();
        });

        it('should wait for the session to become loaded without requiring another action', () => {
            const sessionStateSelector = store.overrideSelector(sessionState, 'not-loaded');
            store.refreshState();

            const emittedActions: Action[] = [];
            const subscription = effects.ensureMkaAuthorizationLoaded$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                expect(emittedActions).toEqual([]);

                // Die Änderung des Session-State muss den wartenden Auftrag fortsetzen.
                sessionStateSelector.setResult('loaded');
                store.refreshState();

                expect(emittedActions).toEqual([mkaAuthorizationActions.loadMkaAuthorization()]);
                expect(httpServiceMock.loadMkaAuthorization).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });

        it.each(['unauthorized', 'technical-error'] as const)(
            'should finish the current request without emitting when the session is already %s',
            loadState => {
                const sessionStateSelector = store.overrideSelector(sessionState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];
                const onError = vi.fn();
                const onComplete = vi.fn();

                const subscription = effects.ensureMkaAuthorizationLoaded$.subscribe({
                    next: action => emittedActions.push(action),
                    error: onError,
                    complete: onComplete,
                });

                try {
                    action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                    expect(emittedActions).toEqual([]);
                    expect(onError).not.toHaveBeenCalled();
                    expect(onComplete).not.toHaveBeenCalled();
                    expect(subscription.closed).toBe(false);

                    // Der vorherige Auftrag ist abgeschlossen und wartet nicht weiter.
                    sessionStateSelector.setResult('loaded');
                    store.refreshState();

                    expect(emittedActions).toEqual([]);

                    // Der äußere Effect verarbeitet weiterhin neue Aufträge.
                    action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                    expect(emittedActions).toEqual([mkaAuthorizationActions.loadMkaAuthorization()]);
                    expect(onError).not.toHaveBeenCalled();
                    expect(onComplete).not.toHaveBeenCalled();
                    expect(subscription.closed).toBe(false);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it.each(['unauthorized', 'technical-error'] as const)(
            'should finish a pending request without emitting when the session becomes %s',
            loadState => {
                const sessionStateSelector = store.overrideSelector(sessionState, 'not-loaded');
                store.refreshState();

                const emittedActions: Action[] = [];
                const onError = vi.fn();
                const onComplete = vi.fn();

                const subscription = effects.ensureMkaAuthorizationLoaded$.subscribe({
                    next: action => emittedActions.push(action),
                    error: onError,
                    complete: onComplete,
                });

                try {
                    action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                    expect(emittedActions).toEqual([]);

                    sessionStateSelector.setResult(loadState);
                    store.refreshState();

                    expect(emittedActions).toEqual([]);
                    expect(onError).not.toHaveBeenCalled();
                    expect(onComplete).not.toHaveBeenCalled();
                    expect(subscription.closed).toBe(false);

                    // Ein Fehler beendet das innere Warten.
                    // Ein späteres loaded darf den alten Auftrag nicht wiederbeleben.
                    sessionStateSelector.setResult('loaded');
                    store.refreshState();

                    expect(emittedActions).toEqual([]);

                    action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                    expect(emittedActions).toEqual([mkaAuthorizationActions.loadMkaAuthorization()]);
                    expect(onError).not.toHaveBeenCalled();
                    expect(onComplete).not.toHaveBeenCalled();
                    expect(subscription.closed).toBe(false);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it('should ignore further commands while waiting for the session (exhaustMap)', () => {
            const sessionStateSelector = store.overrideSelector(sessionState, 'not-loaded');
            store.refreshState();

            const selectSpy = vi.spyOn(store, 'select');
            const emittedActions: Action[] = [];

            const subscription = effects.ensureMkaAuthorizationLoaded$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                expect(selectSpy).toHaveBeenCalledTimes(1);
                expect(selectSpy).toHaveBeenCalledWith(sessionState);
                expect(emittedActions).toEqual([]);

                // Weitere Commands dürfen das laufende Warten weder ersetzen
                // noch zusätzliche wartende Aufträge erzeugen.
                action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());
                action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                expect(selectSpy).toHaveBeenCalledTimes(1);
                expect(emittedActions).toEqual([]);

                sessionStateSelector.setResult('loaded');
                store.refreshState();

                expect(emittedActions).toEqual([mkaAuthorizationActions.loadMkaAuthorization()]);
                expect(selectSpy).toHaveBeenCalledTimes(1);

                // Nach Abschluss kann ein neuer Auftrag verarbeitet werden.
                action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                expect(selectSpy).toHaveBeenCalledTimes(2);
                expect(emittedActions).toEqual([
                    mkaAuthorizationActions.loadMkaAuthorization(),
                    mkaAuthorizationActions.loadMkaAuthorization(),
                ]);
            } finally {
                subscription.unsubscribe();
                selectSpy.mockRestore();
            }
        });

        it('should stop observing the session after success and keep the effect stream alive', () => {
            const sessionStateSelector = store.overrideSelector(sessionState, 'not-loaded');
            store.refreshState();

            const emittedActions: Action[] = [];
            const onError = vi.fn();
            const onComplete = vi.fn();

            const subscription = effects.ensureMkaAuthorizationLoaded$.subscribe({
                next: action => emittedActions.push(action),
                error: onError,
                complete: onComplete,
            });

            try {
                action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                sessionStateSelector.setResult('loaded');
                store.refreshState();

                expect(emittedActions).toEqual([mkaAuthorizationActions.loadMkaAuthorization()]);
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);

                // Weitere State-Änderungen allein dürfen keine Folgeaction erzeugen.
                sessionStateSelector.setResult('unauthorized');
                store.refreshState();

                sessionStateSelector.setResult('loaded');
                store.refreshState();

                expect(emittedActions).toEqual([mkaAuthorizationActions.loadMkaAuthorization()]);

                // Dieselbe Subscription muss weitere Commands verarbeiten.
                // Ein take(1) im äußeren Stream würde dies verhindern.
                action$.next(mkaAuthorizationActions.ensureMkaAuthorizationLoaded());

                expect(emittedActions).toEqual([
                    mkaAuthorizationActions.loadMkaAuthorization(),
                    mkaAuthorizationActions.loadMkaAuthorization(),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should ignore unrelated actions and session changes without an ensure command', () => {
            const sessionStateSelector = store.overrideSelector(sessionState, 'not-loaded');
            store.refreshState();

            const emittedActions: Action[] = [];
            const subscription = effects.ensureMkaAuthorizationLoaded$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(mkaAuthorizationActions.loadMkaAuthorization());

                sessionStateSelector.setResult('loaded');
                store.refreshState();

                action$.next(mkaAuthorizationActions.loadMkaAuthorization());

                expect(emittedActions).toEqual([]);
                expect(httpServiceMock.loadMkaAuthorization).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });
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

            const promise = firstValueFrom(effects.loadMkaAuthorization$);

            action$.next(mkaAuthorizationActions.loadMkaAuthorization());
            const emitted = await promise;

            expect(emitted).toEqual(mkaAuthorizationActions.mkaAuthorizationLoaded({ user: user }));
            expect(httpServiceMock.loadMkaAuthorization).toHaveBeenCalledTimes(1);
        });

        it('should not load authorization when already loaded', () => {
            store.overrideSelector(fromMkaAuthorization.authorizationLoadState, 'loaded');
            store.refreshState();

            const emitted = vi.fn();
            const subscription = effects.loadMkaAuthorization$.subscribe(emitted);

            action$.next(mkaAuthorizationActions.loadMkaAuthorization());

            expect(httpServiceMock.loadMkaAuthorization).not.toHaveBeenCalled();
            expect(emitted).not.toHaveBeenCalled();

            subscription.unsubscribe();
        });

        it('should not load authorization when failed', () => {
            store.overrideSelector(fromMkaAuthorization.authorizationLoadState, 'failed');
            store.refreshState();

            const emitted = vi.fn();
            const subscription = effects.loadMkaAuthorization$.subscribe(emitted);

            action$.next(mkaAuthorizationActions.loadMkaAuthorization());

            expect(httpServiceMock.loadMkaAuthorization).not.toHaveBeenCalled();
            expect(emitted).not.toHaveBeenCalled();

            subscription.unsubscribe();
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

            const promise = firstValueFrom(effects.loadMkaAuthorization$);

            action$.next(mkaAuthorizationActions.loadMkaAuthorization());
            const emitted = await promise;

            expect(emitted).toEqual(mkaAuthorizationActions.loadMkaAuthorizationFailed());
            expect(httpServiceMock.loadMkaAuthorization).toHaveBeenCalledTimes(1);
        });
    });

    describe('loadMkaAuthorizationFailed$', () => {
        it('publishes error when loadMkaAuthorizationFailed', async () => {
            const user: User = {
                anonym: false,
                fullName: 'Full Name',
                berechtigungen: ['STANDARD', 'PRIVAT'],
            };

            const promise = firstValueFrom(effects.mkaAuthorizationLoaded$);

            action$.next(mkaAuthorizationActions.mkaAuthorizationLoaded({ user: user }));
            await promise;

            expect(authSessionFacadeMock.synchronizeUser).toHaveBeenCalledTimes(1);
            expect(authSessionFacadeMock.synchronizeUser).toHaveBeenCalledWith(user);
        });
    });

    describe('loadMkaAuthorizationFailed$', () => {
        it('publishes error when loadMkaAuthorizationFailed', async () => {
            const promise = firstValueFrom(effects.loadMkaAuthorizationFailed$);

            action$.next(mkaAuthorizationActions.loadMkaAuthorizationFailed());
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
            );
        });
    });
});
