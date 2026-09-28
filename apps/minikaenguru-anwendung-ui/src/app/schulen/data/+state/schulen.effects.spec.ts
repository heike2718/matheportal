import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { SchulenEffects } from './schulen.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ArbeitskontextHttpService } from '../../../core/services/arbeitskontext-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import {
    DURCHFUEHRUNGSART,
    Wettbewerbsdurchfuehrender,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import {
    durchfuehrenderAngelegt,
    durchfuehrenderGeladen,
} from '../../../core/wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende-store.events';
import { schulenActions } from './schulen.actions';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { getEffectsMetadata } from '@ngrx/effects';
import { Schule } from '../../../core/model/schulkatalog.model';

describe('SchulenEffects', () => {
    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/authurls/login',
    });

    let action$: Subject<Action>;
    let effects: SchulenEffects;

    let httpServiceMock: {
        loadLehrpersonSchulen: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        httpServiceMock = {
            loadLehrpersonSchulen: vi.fn(),
        };

        messagePublisherMock = {
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                SchulenEffects,
                provideMockActions(() => action$),
                {
                    provide: ArbeitskontextHttpService,
                    useValue: httpServiceMock,
                },
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
            ],
        });

        effects = TestBed.inject(SchulenEffects);
    });

    describe('checkLoadSchulenOnWettbewerbsdurchfuehrenderGeladen', () => {
        let wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender = {
            durchfuehrungsart: DURCHFUEHRUNGSART.privat,
            newsletter: false,
            zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
        };

        it('should not dispatch any action when durchfuehrenderAngelegt DURCHFUEHRUNGSART.privat', async () => {
            const emittedActions: Action[] = [];
            const subscription = effects.checkLoadSchulenOnWettbewerbsdurchfuehrenderGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(durchfuehrenderAngelegt({ wettbewerbsdurchfuehrender }));

            expect(emittedActions).toEqual([]);

            subscription.unsubscribe();
        });

        it('should not dispatch any action when durchfuehrenderGeladen DURCHFUEHRUNGSART.privat', async () => {
            const emittedActions: Action[] = [];
            const subscription = effects.checkLoadSchulenOnWettbewerbsdurchfuehrenderGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(durchfuehrenderGeladen({ wettbewerbsdurchfuehrender }));

            expect(emittedActions).toEqual([]);

            subscription.unsubscribe();
        });

        it('should dispatch schulenLaden when durchfuehrenderAngelegt DURCHFUEHRUNGSART.schule', async () => {
            wettbewerbsdurchfuehrender = { ...wettbewerbsdurchfuehrender, durchfuehrungsart: DURCHFUEHRUNGSART.schule };

            const promise = firstValueFrom(effects.checkLoadSchulenOnWettbewerbsdurchfuehrenderGeladen$);

            action$.next(durchfuehrenderAngelegt({ wettbewerbsdurchfuehrender }));

            const emitted = await promise;

            expect(emitted).toEqual(schulenActions.schulenLaden());
        });

        it('should dispatch schulenLaden when durchfuehrenderGeladen DURCHFUEHRUNGSART.schule', async () => {
            wettbewerbsdurchfuehrender = { ...wettbewerbsdurchfuehrender, durchfuehrungsart: DURCHFUEHRUNGSART.schule };

            const promise = firstValueFrom(effects.checkLoadSchulenOnWettbewerbsdurchfuehrenderGeladen$);

            action$.next(durchfuehrenderGeladen({ wettbewerbsdurchfuehrender }));

            const emitted = await promise;

            expect(emitted).toEqual(schulenActions.schulenLaden());
        });
    });

    describe('schulenLaden$', () => {
        const schulen1: Schule[] = [
            {
                kuerzel: 'SCHULE-1',
                name: 'Neuhofschule',
                ort: {
                    kuerzel: 'ORT-1',
                    name: 'erster Ort',
                    land: {
                        kuerzel: 'DE-BY',
                        name: 'Bayern',
                        anzahlOrte: 19,
                    },
                    anzahlSchulen: 1,
                },
            },
        ];

        const schulen2: Schule[] = [
            {
                ...schulen1[0],
                kuerzel: 'SCHULE-2',
                name: 'Albert-Einstein-Schule',
            },
        ];

        it('should call the httpService and map to schulenGeladen when successful', async () => {
            httpServiceMock.loadLehrpersonSchulen.mockReturnValue(of(schulen1));

            const promise = firstValueFrom(effects.schulenLaden$);

            action$.next(schulenActions.schulenLaden());
            const emitted = await promise;

            expect(emitted).toEqual(schulenActions.schulenGeladen({ schulen: schulen1 }));
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledWith();
        });

        it('should switch to the latest action and cancel previous pending requests (switchMap)', () => {
            const httpFirst$ = new Subject<Schule[]>();
            const httpSecond$ = new Subject<Schule[]>();
            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadLehrpersonSchulen
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.schulenLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                // Erste Anfrage bleibt zunächst offen.
                action$.next(schulenActions.schulenLaden());

                expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();

                // Eine weitere Action muss die erste Anfrage sofort abbestellen.
                action$.next(schulenActions.schulenLaden());

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledTimes(2);

                // Eine verspätete Antwort der ersten Anfrage wird ignoriert.
                httpFirst$.next(schulen1);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                // Nur die Antwort der aktuellen Anfrage erzeugt eine Folgeaction.
                httpSecond$.next(schulen2);
                httpSecond$.complete();

                expect(emittedActions).toEqual([schulenActions.schulenGeladen({ schulen: schulen2 })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to schulenLadenFailed when the httpService returns an HttpErrorResponse', async () => {
            httpServiceMock.loadLehrpersonSchulen.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.schulenLaden$);

            action$.next(schulenActions.schulenLaden());
            const emitted = await promise;

            expect(emitted).toEqual(schulenActions.schulenLadenFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledWith();
        });

        it('should map to schulenLadenFailed when the httpService returns another Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadLehrpersonSchulen.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.schulenLaden$);

            action$.next(schulenActions.schulenLaden());
            const emitted = await promise;

            expect(emitted).toEqual(schulenActions.schulenLadenFailed({ error }));
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledWith();
        });

        it('should keep the effect stream alive after an error occurred (catchError inside switchMap)', () => {
            const httpFirst$ = new Subject<Schule[]>();
            const httpSecond$ = new Subject<Schule[]>();

            httpServiceMock.loadLehrpersonSchulen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const onError = vi.fn();
            const onComplete = vi.fn();

            const subscription = effects.schulenLaden$.subscribe({
                next: action => emittedActions.push(action),
                error: onError,
                complete: onComplete,
            });

            try {
                action$.next(schulenActions.schulenLaden());
                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    schulenActions.schulenLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);

                // Dieselbe Subscription muss weitere Actions verarbeiten.
                // Ein catchError außerhalb von switchMap würde bei Rückgabe
                // von of(failedAction) den gesamten Effect-Stream beenden.
                action$.next(schulenActions.schulenLaden());

                expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledTimes(2);

                httpSecond$.next(schulen2);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    schulenActions.schulenLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                    schulenActions.schulenGeladen({ schulen: schulen2 }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('schulenLadenFailed$', () => {
        it('should publish the technical error message for an HttpErrorResponse', async () => {
            const promise = firstValueFrom(effects.schulenLadenFailed$);

            action$.next(schulenActions.schulenLadenFailed({ error: httpServerErrorResponse }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
            expect(httpServiceMock.loadLehrpersonSchulen).not.toHaveBeenCalled();
        });

        it('should publish the technical error message for another Error', async () => {
            const error = new Error('uiuiui!');
            const promise = firstValueFrom(effects.schulenLadenFailed$);

            action$.next(schulenActions.schulenLadenFailed({ error }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
            expect(httpServiceMock.loadLehrpersonSchulen).not.toHaveBeenCalled();
        });

        it('should publish the mapped error message for a forbidden response', async () => {
            const error = new HttpErrorResponse({
                status: 403,
                statusText: 'Forbidden',
            });
            const promise = firstValueFrom(effects.schulenLadenFailed$);

            action$.next(schulenActions.schulenLadenFailed({ error }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Sie haben leider keine Berechtigung für diese Aktion'
            );
        });

        it('should be configured not to dispatch any action', () => {
            const metadata = getEffectsMetadata(effects);

            expect(metadata.schulenLadenFailed$?.dispatch).toBe(false);
        });

        it('should ignore unrelated actions', () => {
            const emittedActions: Action[] = [];
            const subscription = effects.schulenLadenFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(schulenActions.schulenLaden());

                expect(emittedActions).toEqual([]);
                expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });
    });
});
