import { Action, Store } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { WettbewerbEffects } from './wettbewerb.effects';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { WettbewerbHttpService } from '../wettbewerb-http.service';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../../model/wettbewerb.model';
import { WettbewerbActions } from './wettbewerb.actions';
import { User } from '@matheportal/auth-model';
import { mkaAuthorizationLoaded } from '../../../authorization/authorization-api/mka-authorization-store.events';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { fromWettbewerb } from './wettbewerb.selectors';
import { a } from 'node_modules/vitest/dist/chunks/suite.d.udJtyAgw';

describe('WettbewerbEffects', () => {
    let action$: Subject<Action>;
    let effects: WettbewerbEffects;
    let store: MockStore;

    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    let httpServiceMock: { loadWettbewerb: ReturnType<typeof vi.fn> };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/api/wettbewerb',
    });

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        httpServiceMock = {
            loadWettbewerb: vi.fn(),
        };

        messagePublisherMock = {
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                WettbewerbEffects,
                provideMockStore(),
                provideMockActions(() => action$),
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
                {
                    provide: WettbewerbHttpService,
                    useValue: httpServiceMock,
                },
            ],
        });

        effects = TestBed.inject(WettbewerbEffects);
        store = TestBed.inject(Store) as MockStore;
    });

    describe('ensureWettbewerbGeladen$', () => {
        it('should map to wettbewerbLaden when wettbewerb is not loaded', async () => {
            store.overrideSelector(fromWettbewerb.selectWettbewerbLoadState, 'not-loaded');
            store.refreshState();

            const emittedActions: Action[] = [];

            const subscription = effects.ensureWettbewerbGeladen$.subscribe({
                next: action => emittedActions.push(action),
            });

            try {
                action$.next(WettbewerbActions.ensureWettbewerbGeladen());

                expect(emittedActions).toEqual([WettbewerbActions.wettbewerbLaden()]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to wettbewerbLaden when wettbewerbLoadSate is technical-error', async () => {
            store.overrideSelector(fromWettbewerb.selectWettbewerbLoadState, 'technical-error');
            store.refreshState();

            const emittedActions: Action[] = [];

            const subscription = effects.ensureWettbewerbGeladen$.subscribe({
                next: action => emittedActions.push(action),
            });

            try {
                action$.next(WettbewerbActions.ensureWettbewerbGeladen());

                expect(emittedActions).toEqual([WettbewerbActions.wettbewerbLaden()]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to wettbewerbLaden when wettbewerb is already loaded', async () => {
            store.overrideSelector(fromWettbewerb.selectWettbewerbLoadState, 'loaded');
            store.refreshState();

            const emittedActions: Action[] = [];

            const subscription = effects.ensureWettbewerbGeladen$.subscribe({
                next: action => emittedActions.push(action),
            });

            try {
                action$.next(WettbewerbActions.ensureWettbewerbGeladen());

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to wettbewerbLaden when wettbewerbLoadState is unauthorized', async () => {
            store.overrideSelector(fromWettbewerb.selectWettbewerbLoadState, 'unauthorized');
            store.refreshState();

            const emittedActions: Action[] = [];

            const subscription = effects.ensureWettbewerbGeladen$.subscribe({
                next: action => emittedActions.push(action),
            });

            try {
                action$.next(WettbewerbActions.ensureWettbewerbGeladen());

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('wettbewerbLadenOnAuthorizationLoaded$', () => {
        it('should dispatch loadWettbewerb', async () => {
            const user: User = {
                anonym: false,
                berechtigungen: ['SCHULE', 'STANDARD'],
                fullName: 'Amy',
            };

            const promise = firstValueFrom(effects.wettbewerbLadenOnAuthorizationLoaded$);

            action$.next(mkaAuthorizationLoaded({ user }));

            const emitted = await promise;

            expect(emitted).toEqual(WettbewerbActions.wettbewerbLaden());
        });
    });

    describe('wettbewerbLaden$', () => {
        const wettbewerb: Wettbewerb = {
            beginn: '01.01.2029',
            ende: '31.07.2029',
            freischaltungPrivat: '15.06.2029',
            freischaltungSchulen: '14.03.2029',
            jahr: 2029,
            status: WETTBEWERBSSTATUS.anmeldung,
        };

        it('should not call the httpService and not map to wettbewerbLoaded when wettbewerb is already loaded', async () => {
            store.overrideSelector(fromWettbewerb.selectWettbewerbLoaded, true);
            store.refreshState();

            const emittedActions: Action[] = [];
            const subscription = effects.wettbewerbLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(WettbewerbActions.wettbewerbLaden());

                expect(emittedActions).toEqual([]);
                expect(httpServiceMock.loadWettbewerb).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to wettbewerbLoaded when wettbewerb is not loaded', async () => {
            httpServiceMock.loadWettbewerb.mockReturnValueOnce(of(wettbewerb));

            store.overrideSelector(fromWettbewerb.selectWettbewerbLoaded, false);
            store.refreshState();

            const promise = firstValueFrom(effects.wettbewerbLaden$);

            action$.next(WettbewerbActions.wettbewerbLaden());

            const emitted = await promise;

            expect(emitted).toEqual(WettbewerbActions.wettbewerbGeladen({ wettbewerb }));
            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledOnce();
        });

        it('should not cancel previous pending requests (exhaustMap)', async () => {
            store.overrideSelector(fromWettbewerb.selectWettbewerbLoaded, false);
            store.refreshState();

            const httpFirst$ = new Subject<Wettbewerb>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadWettbewerb.mockReturnValueOnce(httpFirst$);

            const emittedActions: Action[] = [];
            const subscription = effects.wettbewerbLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                // --- ACTION 1: Erste Action triggern ---
                action$.next(WettbewerbActions.wettbewerbLaden());

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledTimes(1);

                // --- ACTION 2: Zweite Action triggern (während Request 1 noch läuft) ---
                action$.next(WettbewerbActions.wettbewerbLaden());

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledTimes(1);

                httpFirst$.next(wettbewerb);
                httpFirst$.complete();

                expect(emittedActions).toEqual([WettbewerbActions.wettbewerbGeladen({ wettbewerb })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and mat to loadWettbewerbFailed when httpErrorResponse', async () => {
            store.overrideSelector(fromWettbewerb.selectWettbewerbLoaded, false);
            store.refreshState();

            httpServiceMock.loadWettbewerb.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.wettbewerbLaden$);

            action$.next(WettbewerbActions.wettbewerbLaden());

            const emitted = await promise;

            expect(emitted).toEqual(WettbewerbActions.wettbewerbLadenFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledOnce();
        });

        it('should call the httpService and mat to loadWettbewerbFailed when other Error', async () => {
            store.overrideSelector(fromWettbewerb.selectWettbewerbLoaded, false);
            store.refreshState();

            const error = new Error('uiuiui!');

            httpServiceMock.loadWettbewerb.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.wettbewerbLaden$);

            action$.next(WettbewerbActions.wettbewerbLaden());

            const emitted = await promise;

            expect(emitted).toEqual(WettbewerbActions.wettbewerbLadenFailed({ error }));
            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledOnce();
        });

        it('should keep the effect stream alive after an error occured', () => {
            store.overrideSelector(fromWettbewerb.selectWettbewerbLoaded, false);
            store.refreshState();

            const httpFirst$ = new Subject<Wettbewerb>();
            const httpSecond$ = new Subject<Wettbewerb>();

            // Erster Request wirft error, zweiter Request erfolgreich
            httpServiceMock.loadWettbewerb.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.wettbewerbLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(WettbewerbActions.wettbewerbLaden());

            httpFirst$.error(httpServerErrorResponse);

            expect(emittedActions).toEqual([
                WettbewerbActions.wettbewerbLadenFailed({ error: httpServerErrorResponse }),
            ]);

            action$.next(WettbewerbActions.wettbewerbLaden());

            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledTimes(2);

            httpSecond$.next(wettbewerb);
            httpSecond$.complete();

            expect(emittedActions).toEqual([
                WettbewerbActions.wettbewerbLadenFailed({ error: httpServerErrorResponse }),
                WettbewerbActions.wettbewerbGeladen({ wettbewerb }),
            ]);

            subscription.unsubscribe();
        });
    });

    describe('wettbewerbLadenFailed$', () => {
        it('should trigger an error message and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.wettbewerbLadenFailed$);

            action$.next(WettbewerbActions.wettbewerbLadenFailed({ error: httpServerErrorResponse }));
            await promise;

            expect(httpServiceMock.loadWettbewerb).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
        });
    });
});
