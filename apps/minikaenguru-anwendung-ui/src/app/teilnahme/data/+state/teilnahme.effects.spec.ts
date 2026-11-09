import { Action, Store } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { TeilnahmeEffects } from './teilnahme.effects';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { TeilnahmeHttpService } from '../teilnahme-http.service';
import { TeilnahmeActions } from './teilnahme.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectTeilnahmeLoadState } from './teilnahme.selectors';
import { Teilnahme } from '../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';

describe('TeilnahmeEffects', () => {
    let action$: Subject<Action>;
    let effects: TeilnahmeEffects;
    let store: MockStore;

    const teilnahme: Teilnahme = {
        angemeldetAm: '27.02.2027',
        anzahlKinder: 56,
        anzahlKlassen: 2,
        anzahlLoesungszettel: 14,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
        jahr: 2027,
        kuerzel: 'S1234567',
    };

    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    let httpServiceMock: {
        loadAktuellePrivatteilnahme: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishWarning: ReturnType<typeof vi.fn>; publishError: ReturnType<typeof vi.fn> };

    const notFoundResponse = new HttpErrorResponse({
        status: 404,
        statusText: 'NotFound',
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
        };

        messagePublisherMock = {
            publishWarning: vi.fn(),
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                TeilnahmeEffects,
                provideMockStore(),
                provideMockActions(() => action$),
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
                {
                    provide: TeilnahmeHttpService,
                    useValue: httpServiceMock,
                },
            ],
        });

        effects = TestBed.inject(TeilnahmeEffects);
        store = TestBed.inject(Store) as MockStore;
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
                    action$.next(TeilnahmeActions.ensurePrivatteilnahmeLoaded());

                    expect(emittedActions).toEqual([TeilnahmeActions.privatteilnahmeLaden()]);
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
                    action$.next(TeilnahmeActions.ensurePrivatteilnahmeLoaded());

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

            action$.next(TeilnahmeActions.privatteilnahmeLaden());
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.teilnahmeGeladen({ teilnahme }));

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
                action$.next(TeilnahmeActions.privatteilnahmeLaden());

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledTimes(1);

                action$.next(TeilnahmeActions.privatteilnahmeLaden());
                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledTimes(2);

                httpFirst$.next(firstResult);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                httpSecond$.next(secondResult);
                httpSecond$.complete();

                expect(emittedActions).toEqual([TeilnahmeActions.teilnahmeGeladen({ teilnahme: secondResult })]);
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
                action$.next(TeilnahmeActions.privatteilnahmeLaden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(TeilnahmeActions.privatteilnahmeLaden());

                expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }),
                    TeilnahmeActions.teilnahmeGeladen({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to teilnahmeLadenFailed error', async () => {
            httpServiceMock.loadAktuellePrivatteilnahme.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.privatteilnahmeLaden$);

            action$.next(TeilnahmeActions.privatteilnahmeLaden());
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }));

            expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledOnce();
        });
    });

    describe('teilnahmeLadenFailed$', () => {
        it('should show a warning when http-status is 404 and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.teilnahmeLadenFailed$);

            action$.next(
                TeilnahmeActions.teilnahmeLadenFailed({
                    error: notFoundResponse,
                })
            );
            await promise;

            expect(messagePublisherMock.publishWarning).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishWarning).toHaveBeenCalledWith(
                'Sie sind noch nicht zum aktuellen Wettbewerb angemeldet.'
            );

            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
        });

        it('should show an error when http-status is 500 and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.teilnahmeLadenFailed$);

            action$.next(
                TeilnahmeActions.teilnahmeLadenFailed({
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
