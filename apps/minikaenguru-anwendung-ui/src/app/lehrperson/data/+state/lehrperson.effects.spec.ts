import { Action, Store } from '@ngrx/store';
import { LehrpersonActions } from './lehrperson.actions';
import { Schule } from '../../../core/model/schulkatalog.model';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { selectSchulenLoadState } from './lehrperson.selectors';
import { TestBed } from '@angular/core/testing';
import { LehrpersonEffects } from './lehrperson.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DefaultUrlSerializer, Navigation, Router } from '@angular/router';
import { ArbeitskontextHttpService } from '../../../core/services/arbeitskontext-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { HttpErrorResponse } from '@angular/common/http';
import { getEffectsMetadata } from '@ngrx/effects';
import { ErrorResponse, TECHNISCHER_FEHLER_FEHLERMELDUNG } from '@matheportal/shared-model';

describe('LehrpersonEffects', () => {
    const urlSerializer = new DefaultUrlSerializer();

    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/authurls/login',
    });

    const routerMock = {
        navigate: vi.fn(),
        currentNavigation: vi.fn<() => Pick<Navigation, 'extractedUrl' | 'finalUrl'> | null>(),
        parseUrl: vi.fn((url: string) => urlSerializer.parse(url)),
        url: '/minikaenguru-anwendung',
    };

    let action$: Subject<Action>;
    let effects: LehrpersonEffects;
    let store: MockStore;

    let httpServiceMock: {
        loadLehrpersonSchulen: ReturnType<typeof vi.fn>;
        loadSchuleWettbewerbskontext: ReturnType<typeof vi.fn>;
        loadSchulkollegium: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.resetAllMocks();
        routerMock.currentNavigation.mockReturnValue(null);
        routerMock.parseUrl.mockImplementation(url => urlSerializer.parse(url));
        routerMock.url = '/minikaenguru-anwendung';

        action$ = new Subject<Action>();

        httpServiceMock = {
            loadLehrpersonSchulen: vi.fn(),
            loadSchuleWettbewerbskontext: vi.fn(),
            loadSchulkollegium: vi.fn(),
        };

        messagePublisherMock = {
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                LehrpersonEffects,
                provideMockActions(() => action$),
                provideMockStore(),
                { provide: Router, useValue: routerMock },
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

        effects = TestBed.inject(LehrpersonEffects);
        store = TestBed.inject(Store) as MockStore;
    });

    describe('ensureSchulenGeladen', () => {
        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to wettbewerbLaden when loadState %s',
            async loadState => {
                store.overrideSelector(selectSchulenLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensureSchulenGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(LehrpersonActions.ensureSchulenGeladen());

                    expect(emittedActions).toEqual([LehrpersonActions.schulenLaden()]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it.each(['loaded', 'unauthorized'] as const)(
            'should not map to wettbewerbLaden when state is %s',
            async loadState => {
                store.overrideSelector(selectSchulenLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensureSchulenGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(LehrpersonActions.ensureSchulenGeladen());

                    expect(emittedActions).toEqual([]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );
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

            action$.next(LehrpersonActions.schulenLaden());
            const emitted = await promise;

            expect(emitted).toEqual(LehrpersonActions.schulenGeladen({ schulen: schulen1 }));
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledOnce();
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
                action$.next(LehrpersonActions.schulenLaden());

                expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();

                // Eine weitere Action muss die erste Anfrage sofort abbestellen.
                action$.next(LehrpersonActions.schulenLaden());

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledTimes(2);

                // Eine verspätete Antwort der ersten Anfrage wird ignoriert.
                httpFirst$.next(schulen1);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                // Nur die Antwort der aktuellen Anfrage erzeugt eine Folgeaction.
                httpSecond$.next(schulen2);
                httpSecond$.complete();

                expect(emittedActions).toEqual([LehrpersonActions.schulenGeladen({ schulen: schulen2 })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to schulenLadenFailed when the httpService returns an HttpErrorResponse', async () => {
            httpServiceMock.loadLehrpersonSchulen.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.schulenLaden$);

            action$.next(LehrpersonActions.schulenLaden());
            const emitted = await promise;

            expect(emitted).toEqual(LehrpersonActions.schulenLadenFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledOnce();
        });

        it('should map to schulenLadenFailed when the httpService returns another Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadLehrpersonSchulen.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.schulenLaden$);

            action$.next(LehrpersonActions.schulenLaden());
            const emitted = await promise;

            expect(emitted).toEqual(LehrpersonActions.schulenLadenFailed({ error }));
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledOnce();
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
                action$.next(LehrpersonActions.schulenLaden());
                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    LehrpersonActions.schulenLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);

                // Dieselbe Subscription muss weitere Actions verarbeiten.
                // Ein catchError außerhalb von switchMap würde bei Rückgabe
                // von of(failedAction) den gesamten Effect-Stream beenden.
                action$.next(LehrpersonActions.schulenLaden());

                expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledTimes(2);

                httpSecond$.next(schulen2);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    LehrpersonActions.schulenLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                    LehrpersonActions.schulenGeladen({ schulen: schulen2 }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('schulenGeladen$', () => {
        it('should map to wettbewerbsorganisationGestartet when exactly 1 school was loaded and einstiegsseite', async () => {
            const schule: Schule = {
                kuerzel: 'S1234567',
                name: 'Baumschule',
                ort: {
                    kuerzel: 'O1234567',
                    name: 'Waldeck',
                    anzahlSchulen: 3,
                    land: {
                        kuerzel: 'DE-TH',
                        name: 'Thüringen',
                        anzahlOrte: 354,
                    },
                },
            };

            const promise = firstValueFrom(effects.schulenGeladen$);

            action$.next(LehrpersonActions.schulenGeladen({ schulen: [schule] }));

            const emitted = await promise;

            expect(emitted).toEqual(LehrpersonActions.wettbewerbsorganisationGestartet({ schulkuerzel: 'S1234567' }));
        });

        it('should not emitt an action when there is exactly one school but url is that of schule', async () => {
            const schule: Schule = {
                kuerzel: 'S1234567',
                name: 'Baumschule',
                ort: {
                    kuerzel: 'O1234567',
                    name: 'Waldeck',
                    anzahlSchulen: 3,
                    land: {
                        kuerzel: 'DE-TH',
                        name: 'Thüringen',
                        anzahlOrte: 354,
                    },
                },
            };

            routerMock.url = '/minikaenguru-anwendung/lehrperson';

            routerMock.currentNavigation.mockReturnValue({
                extractedUrl: urlSerializer.parse('/minikaenguru-anwendung/lehrperson/schule/S1234567'),
            });

            const emittedActions: Action[] = [];
            const subscription = effects.schulenGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(LehrpersonActions.schulenGeladen({ schulen: [schule] }));
                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not emit an action when there are more than one schools', async () => {
            const schule1: Schule = {
                kuerzel: 'S1234567',
                name: 'Baumschule',
                ort: {
                    kuerzel: 'O1234567',
                    name: 'Waldeck',
                    anzahlSchulen: 3,
                    land: {
                        kuerzel: 'DE-TH',
                        name: 'Thüringen',
                        anzahlOrte: 354,
                    },
                },
            };

            const schule2: Schule = {
                kuerzel: 'S7654321',
                name: 'Krautschule',
                ort: {
                    kuerzel: 'O1234567',
                    name: 'Waldeck',
                    anzahlSchulen: 3,
                    land: {
                        kuerzel: 'DE-TH',
                        name: 'Thüringen',
                        anzahlOrte: 354,
                    },
                },
            };

            const emittedActions: Action[] = [];
            const subscription = effects.schulenGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(LehrpersonActions.schulenGeladen({ schulen: [schule1, schule2] }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not emit an action when there is no school', async () => {
            const emittedActions: Action[] = [];
            const subscription = effects.schulenGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(LehrpersonActions.schulenGeladen({ schulen: [] }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('schulenLadenFailed$', () => {
        it.each([400, 401, 404, 409, 412, 500] as const)(
            'should map to actionFailed when HttpErrorResponse with httpStatus %i',
            async httpStatus => {
                const errorResponse: ErrorResponse = { message: 'eine Fehlermeldung', constraintViolations: [] };
                const httpError = new HttpErrorResponse({ status: httpStatus, error: errorResponse });
                const promise = firstValueFrom(effects.schulenLadenFailed$);

                action$.next(LehrpersonActions.schulenLadenFailed({ error: httpError }));
                const emitted = await promise;

                expect(emitted).toEqual(LehrpersonActions.actionFailed({ errorMessage: expect.any(String) }));

                expect(messagePublisherMock.publishError).not.toHaveBeenCalledOnce();
                expect(httpServiceMock.loadLehrpersonSchulen).not.toHaveBeenCalled();
                expect(httpServiceMock.loadSchulkollegium).not.toHaveBeenCalled();
            }
        );

        it('should publish the technical error message for another Error', async () => {
            const error = new Error('uiuiui!');
            const promise = firstValueFrom(effects.schulenLadenFailed$);

            action$.next(LehrpersonActions.schulenLadenFailed({ error }));
            const emitted = await promise;

            expect(emitted).toEqual(LehrpersonActions.actionFailed({ errorMessage: TECHNISCHER_FEHLER_FEHLERMELDUNG }));

            expect(messagePublisherMock.publishError).not.toHaveBeenCalledOnce();
            expect(httpServiceMock.loadLehrpersonSchulen).not.toHaveBeenCalled();
            expect(httpServiceMock.loadSchulkollegium).not.toHaveBeenCalled();
        });

        it('should map to berechtigungVerweigert for a forbidden response', async () => {
            const error = new HttpErrorResponse({
                status: 403,
                statusText: 'Forbidden',
            });
            const promise = firstValueFrom(effects.schulenLadenFailed$);

            action$.next(LehrpersonActions.schulenLadenFailed({ error }));
            const emitted = await promise;

            expect(emitted).toEqual(LehrpersonActions.berechtigungVerweigert());
            expect(messagePublisherMock.publishError).not.toHaveBeenCalledOnce();
        });
    });

    describe('actionFailed$', () => {
        it('should publish the errorMessage', async () => {
            const promise = firstValueFrom(effects.actionFailed$);
            action$.next(LehrpersonActions.actionFailed({ errorMessage: 'eine Fehlermeldung' }));

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith('eine Fehlermeldung');
        });

        it('should ignore unrelated actions', () => {
            const emittedActions: Action[] = [];
            const subscription = effects.actionFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(LehrpersonActions.schulenLaden());

                expect(emittedActions).toEqual([]);
                expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should be configured not to dispatch any action', () => {
            const metadata = getEffectsMetadata(effects);

            expect(metadata.actionFailed$?.dispatch).toBe(false);
        });
    });

    describe('wettbewerbsorganisationGestartet$', () => {
        it('should navigate to lehrperson/schule ', async () => {
            const schule: Schule = {
                kuerzel: 'S1234567',
                name: 'Baumschule',
                ort: {
                    kuerzel: 'O1234567',
                    name: 'Waldeck',
                    anzahlSchulen: 3,
                    land: {
                        kuerzel: 'DE-TH',
                        name: 'Thüringen',
                        anzahlOrte: 354,
                    },
                },
            };

            const promise = firstValueFrom(effects.wettbewerbsorganisationGestartet$);

            action$.next(LehrpersonActions.wettbewerbsorganisationGestartet({ schulkuerzel: schule.kuerzel }));

            await promise;

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith([
                '/',
                'minikaenguru-anwendung',
                'lehrperson',
                'schule',
                'S1234567',
            ]);
        });
    });
});
