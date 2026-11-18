import { Action, Store } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectTeilnahme, selectTeilnahmeLoadState } from './privatteilnahme.selectors';
import { Auswertungsart, AUSWERUNGSART, Person, Teilnahme } from '../../../model/teilnahme.model';
import { ANMELDESTATUS } from '../../../../core/model/wettbewerbskontext.model';
import { PrivatteilnahmeEffects } from './privatteilnahme.effects';
import { DURCHFUEHRUNGSART } from '../../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { PrivatteilnahmeActions } from './privatteilnahme.actions';
import { PrivatteilnahmeHttpService } from '../privatteilnahme-http.service';

describe('PrivatteilnahmeEffects', () => {
    let action$: Subject<Action>;
    let effects: PrivatteilnahmeEffects;
    let store: MockStore;

    const teilnahme: Teilnahme = {
        angemeldetAm: '27.02.2027',
        anzahlKinder: 56,
        anzahlKlassen: 2,
        anzahlLoesungszettel: 14,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
        jahr: 2027,
        kuerzel: 'P123456789',
    };

    let httpServiceMock: {
        loadAktuellePrivatteilnahme: ReturnType<typeof vi.fn>;
        privatAnmelden: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishWarning: ReturnType<typeof vi.fn>; publishError: ReturnType<typeof vi.fn> };

    const notFoundResponse = new HttpErrorResponse({
        status: 404,
        statusText: 'NotFound',
        error: 'boom',
        url: '/teilnahme',
    });

    const forbidddenResponse = new HttpErrorResponse({
        status: 403,
        statusText: 'forbidden',
        error: 'boom',
        url: '/teilnahme',
    });

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/teilnahme',
    });

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        httpServiceMock = {
            loadAktuellePrivatteilnahme: vi.fn(),
            privatAnmelden: vi.fn(),
        };

        messagePublisherMock = {
            publishWarning: vi.fn(),
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                PrivatteilnahmeEffects,
                provideMockStore(),
                provideMockActions(() => action$),
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
                {
                    provide: PrivatteilnahmeHttpService,
                    useValue: httpServiceMock,
                },
            ],
        });

        effects = TestBed.inject(PrivatteilnahmeEffects);
        store = TestBed.inject(Store) as MockStore;
        vi.clearAllMocks();
    });

    describe('ensurePrivatteilnahmeLoaded$', () => {
        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to privatteilnahmeLaden when loadState %s',
            async loadState => {
                store.overrideSelector(selectTeilnahmeLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensurePrivatteilnahmeLoaded$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(PrivatteilnahmeActions.ensurePrivatteilnahmeLoaded());

                    expect(emittedActions).toEqual([PrivatteilnahmeActions.privatteilnahmeLaden()]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it.each(['loaded', 'unauthorized'] as const)(
            'should not map to privatteilnahmeLaden when loadState %s',
            async loadState => {
                store.overrideSelector(selectTeilnahmeLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensurePrivatteilnahmeLoaded$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(PrivatteilnahmeActions.ensurePrivatteilnahmeLoaded());

                    expect(emittedActions).toEqual([]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );
    });

    describe('privatteilnahmeLaden$', () => {
        it('should call the httpService and map to teilnahmeGeladen when 200', async () => {
            httpServiceMock.loadAktuellePrivatteilnahme.mockReturnValueOnce(of(teilnahme));

            const promise = firstValueFrom(effects.privatteilnahmeLaden$);

            action$.next(PrivatteilnahmeActions.privatteilnahmeLaden());
            const emitted = await promise;

            expect(emitted).toEqual(PrivatteilnahmeActions.teilnahmeGeladen({ teilnahme }));

            expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledOnce();
        });

        it('should switch to the latest action and cancel previos pending request (switchMap)', async () => {
            const firstResult = teilnahme;

            const secondResult: Teilnahme = {
                ...teilnahme,
                anzahlKlassen: 3,
                anzahlKinder: 74,
                anzahlLoesungszettel: 38,
            };

            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadAktuellePrivatteilnahme
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(PrivatteilnahmeActions.privatteilnahmeLaden());

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledTimes(1);

                action$.next(PrivatteilnahmeActions.privatteilnahmeLaden());
                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledTimes(2);

                httpFirst$.next(firstResult);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                httpSecond$.next(secondResult);
                httpSecond$.complete();

                expect(emittedActions).toEqual([PrivatteilnahmeActions.teilnahmeGeladen({ teilnahme: secondResult })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.loadAktuellePrivatteilnahme
                .mockReturnValueOnce(httpFirst$)
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(PrivatteilnahmeActions.privatteilnahmeLaden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    PrivatteilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(PrivatteilnahmeActions.privatteilnahmeLaden());

                expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    PrivatteilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }),
                    PrivatteilnahmeActions.teilnahmeGeladen({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to teilnahmeLadenFailed error', async () => {
            httpServiceMock.loadAktuellePrivatteilnahme.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.privatteilnahmeLaden$);

            action$.next(PrivatteilnahmeActions.privatteilnahmeLaden());
            const emitted = await promise;

            expect(emitted).toEqual(PrivatteilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }));

            expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledOnce();
        });
    });

    describe('teilnahmeLadenFailed$', () => {
        it('should show the correct warning when http-status is 404 and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.teilnahmeLadenFailed$);

            action$.next(PrivatteilnahmeActions.teilnahmeLadenFailed({ error: notFoundResponse }));

            await promise;

            expect(messagePublisherMock.publishWarning).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishWarning).toHaveBeenCalledWith(
                'Sie sind noch nicht zum aktuellen Wettbewerb angemeldet.'
            );

            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
        });

        it('should show an error when http-status is 500 and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.teilnahmeLadenFailed$);

            action$.next(PrivatteilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }));

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
            );

            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
        });
    });

    describe('privatteilnahmeAnmelden$', () => {
        it('should call the httpService and map to teilnahmeAngemeldet', async () => {
            httpServiceMock.privatAnmelden.mockReturnValueOnce(of(teilnahme));

            const promise = firstValueFrom(effects.privatteilnahmeAnmelden$);

            action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());
            const emitted = await promise;

            expect(emitted).toEqual(PrivatteilnahmeActions.teilnahmeAngemeldet({ teilnahme }));

            expect(httpServiceMock.privatAnmelden).toHaveBeenCalledOnce();
        });

        it('should ignore the second action while the first request is active (exhaustMap)', async () => {
            const httpFirst$ = new Subject<Teilnahme>();

            const firstRequestFinalized = vi.fn();
            const secondRequestFinalized = vi.fn();

            httpServiceMock.privatAnmelden.mockReturnValue(httpFirst$);

            const emittedActions: unknown[] = [];
            const subscription = effects.privatteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(emittedActions).toEqual([]);

                action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(secondRequestFinalized).not.toHaveBeenCalled();
                expect(emittedActions).toEqual([]);

                httpFirst$.next(teilnahme);
                httpFirst$.complete();

                expect(emittedActions).toEqual([PrivatteilnahmeActions.teilnahmeAngemeldet({ teilnahme })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should maps to teilnahmeAnmeldenFailed and keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.privatAnmelden.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    PrivatteilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    PrivatteilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                    PrivatteilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should maps to teilnahmeAnmeldenFailed and keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.privatAnmelden.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    PrivatteilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    PrivatteilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                    PrivatteilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.privatAnmelden.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    PrivatteilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    PrivatteilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                    PrivatteilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to teilnahmeAnmeldenFailed on error', async () => {
            httpServiceMock.privatAnmelden.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.privatteilnahmeAnmelden$);

            action$.next(PrivatteilnahmeActions.privatteilnahmeAnmelden());
            const emitted = await promise;

            expect(emitted).toEqual(PrivatteilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }));

            expect(httpServiceMock.privatAnmelden).toHaveBeenCalledOnce();
        });
    });

    describe('teilnahmeAnmeldenFailed$', () => {
        it('should show an error when http-status is 404 and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.teilnahmeAnmeldenFailed$);

            action$.next(
                PrivatteilnahmeActions.teilnahmeAnmeldenFailed({
                    error: notFoundResponse,
                })
            );
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
            );

            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
        });
        it('should show an error when http-status is 500 and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.teilnahmeAnmeldenFailed$);

            action$.next(
                PrivatteilnahmeActions.teilnahmeAnmeldenFailed({
                    error: httpServerErrorResponse,
                })
            );
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
            );

            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
        });
    });
});
