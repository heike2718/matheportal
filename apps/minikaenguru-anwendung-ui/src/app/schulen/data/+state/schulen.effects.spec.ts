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
import { SchuleActions } from './schulen.actions';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { getEffectsMetadata } from '@ngrx/effects';
import { Schule } from '../../../core/model/schulkatalog.model';
import {
    prepareWettbewerbsorganisation,
    wettbewerbsorganisationGestartet,
    wettbewerbsorganisationVerlassen,
} from '../../../lehrperson/api/lehrperson-store.events';
import { SchuleWettbewerbskontext, Schulkollegium } from '../../../core/model/schule-wettbewerbskontext.model';
import { Router } from '@angular/router';

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

    const routerMock = {
        navigate: vi.fn(),
    };

    let action$: Subject<Action>;
    let effects: SchulenEffects;

    let httpServiceMock: {
        loadLehrpersonSchulen: ReturnType<typeof vi.fn>;
        loadSchuleWettbewerbskontext: ReturnType<typeof vi.fn>;
        loadSchulkollegium: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.resetAllMocks();
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
                SchulenEffects,
                provideMockActions(() => action$),
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

            expect(emitted).toEqual(SchuleActions.schulenLaden());
        });

        it('should dispatch schulenLaden when durchfuehrenderGeladen DURCHFUEHRUNGSART.schule', async () => {
            wettbewerbsdurchfuehrender = { ...wettbewerbsdurchfuehrender, durchfuehrungsart: DURCHFUEHRUNGSART.schule };

            const promise = firstValueFrom(effects.checkLoadSchulenOnWettbewerbsdurchfuehrenderGeladen$);

            action$.next(durchfuehrenderGeladen({ wettbewerbsdurchfuehrender }));

            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.schulenLaden());
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

            action$.next(SchuleActions.schulenLaden());
            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.schulenGeladen({ schulen: schulen1 }));
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
                action$.next(SchuleActions.schulenLaden());

                expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();

                // Eine weitere Action muss die erste Anfrage sofort abbestellen.
                action$.next(SchuleActions.schulenLaden());

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledTimes(2);

                // Eine verspätete Antwort der ersten Anfrage wird ignoriert.
                httpFirst$.next(schulen1);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                // Nur die Antwort der aktuellen Anfrage erzeugt eine Folgeaction.
                httpSecond$.next(schulen2);
                httpSecond$.complete();

                expect(emittedActions).toEqual([SchuleActions.schulenGeladen({ schulen: schulen2 })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to schulenLadenFailed when the httpService returns an HttpErrorResponse', async () => {
            httpServiceMock.loadLehrpersonSchulen.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.schulenLaden$);

            action$.next(SchuleActions.schulenLaden());
            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.schulenLadenFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledOnce();
        });

        it('should map to schulenLadenFailed when the httpService returns another Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadLehrpersonSchulen.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.schulenLaden$);

            action$.next(SchuleActions.schulenLaden());
            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.schulenLadenFailed({ error }));
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
                action$.next(SchuleActions.schulenLaden());
                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    SchuleActions.schulenLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);

                // Dieselbe Subscription muss weitere Actions verarbeiten.
                // Ein catchError außerhalb von switchMap würde bei Rückgabe
                // von of(failedAction) den gesamten Effect-Stream beenden.
                action$.next(SchuleActions.schulenLaden());

                expect(httpServiceMock.loadLehrpersonSchulen).toHaveBeenCalledTimes(2);

                httpSecond$.next(schulen2);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchuleActions.schulenLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                    SchuleActions.schulenGeladen({ schulen: schulen2 }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);
            } finally {
                subscription.unsubscribe();
            }
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

            action$.next(wettbewerbsorganisationGestartet({ schulkuerzel: schule.kuerzel }));

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

    describe('prepareWettbewerbsorganisation$', () => {
        it('should dispatch wettbewerbskontextLaden when wettbewerbsorganisationGestartet', async () => {
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

            const promise = firstValueFrom(effects.prepareWettbewerbsorganisation$);

            action$.next(prepareWettbewerbsorganisation({ schulkuerzel: schule.kuerzel }));

            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.wettbewerbskontextLaden({ schulkuerzel: 'S1234567' }));
        });
    });

    describe('wettbewerbskontextLaden$', () => {
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
        const wettbewerbskontext: SchuleWettbewerbskontext = {
            schule,
            anmeldungMoeglich: true,
            teilnahmerefs: [],
            kollegen: [],
            vertragDSGVOVorhanden: false,
        };

        const andereSchule: Schule = {
            kuerzel: 'S7654321',
            name: 'Waldschule',
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

        const andererWettbewerbskontext: SchuleWettbewerbskontext = {
            schule: andereSchule,
            anmeldungMoeglich: false,
            teilnahmerefs: [],
            kollegen: [],
            vertragDSGVOVorhanden: true,
        };

        it('should call the httpService and map to schulkollegiumGeladen when successful', async () => {
            httpServiceMock.loadSchuleWettbewerbskontext.mockReturnValue(of(wettbewerbskontext));

            const promise = firstValueFrom(effects.wettbewerbskontextLaden$);

            action$.next(SchuleActions.wettbewerbskontextLaden({ schulkuerzel: schule.kuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.wettbewerbskontextGeladen({ wettbewerbskontext }));
            expect(httpServiceMock.loadSchuleWettbewerbskontext).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchuleWettbewerbskontext).toHaveBeenCalledWith('S1234567');
        });

        it('should switch to the latest action and cancel previous pending requests (switchMap)', () => {
            const httpFirst$ = new Subject<SchuleWettbewerbskontext>();
            const httpSecond$ = new Subject<SchuleWettbewerbskontext>();
            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadSchuleWettbewerbskontext
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.wettbewerbskontextLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                // Erste Anfrage bleibt zunächst offen.
                action$.next(SchuleActions.wettbewerbskontextLaden({ schulkuerzel: schule.kuerzel }));

                expect(httpServiceMock.loadSchuleWettbewerbskontext).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();

                // Eine weitere Action muss die erste Anfrage sofort abbestellen.
                action$.next(SchuleActions.wettbewerbskontextLaden({ schulkuerzel: schule.kuerzel }));

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadSchuleWettbewerbskontext).toHaveBeenCalledTimes(2);

                // Eine verspätete Antwort der ersten Anfrage wird ignoriert.
                httpFirst$.next(wettbewerbskontext);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                // Nur die Antwort der aktuellen Anfrage erzeugt eine Folgeaction.
                httpSecond$.next(andererWettbewerbskontext);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchuleActions.wettbewerbskontextGeladen({ wettbewerbskontext: andererWettbewerbskontext }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to wettbewerbskontextLadenFailed when the httpService returns another Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadSchuleWettbewerbskontext.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.wettbewerbskontextLaden$);

            action$.next(SchuleActions.wettbewerbskontextLaden({ schulkuerzel: schule.kuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.wettbewerbskontextLadenFailed({ error }));
            expect(httpServiceMock.loadSchuleWettbewerbskontext).toHaveBeenCalledOnce();
        });

        it('should keep the effect stream alive after an error occurred (catchError inside switchMap)', () => {
            const httpFirst$ = new Subject<SchuleWettbewerbskontext>();
            const httpSecond$ = new Subject<SchuleWettbewerbskontext>();

            httpServiceMock.loadSchuleWettbewerbskontext
                .mockReturnValueOnce(httpFirst$)
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const onError = vi.fn();
            const onComplete = vi.fn();

            const subscription = effects.wettbewerbskontextLaden$.subscribe({
                next: action => emittedActions.push(action),
                error: onError,
                complete: onComplete,
            });

            try {
                action$.next(SchuleActions.wettbewerbskontextLaden({ schulkuerzel: schule.kuerzel }));
                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    SchuleActions.wettbewerbskontextLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);

                // Dieselbe Subscription muss weitere Actions verarbeiten.
                // Ein catchError außerhalb von switchMap würde bei Rückgabe
                // von of(failedAction) den gesamten Effect-Stream beenden.
                action$.next(SchuleActions.wettbewerbskontextLaden({ schulkuerzel: schule.kuerzel }));

                expect(httpServiceMock.loadSchuleWettbewerbskontext).toHaveBeenCalledTimes(2);

                httpSecond$.next(andererWettbewerbskontext);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchuleActions.wettbewerbskontextLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                    SchuleActions.wettbewerbskontextGeladen({ wettbewerbskontext: andererWettbewerbskontext }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('wettbewerbskontextGeladen$', () => {
        it('should dispatch schulkollegiumLaden when wettbewerbskontextGeladen', async () => {
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
            const wettbewerbskontext: SchuleWettbewerbskontext = {
                schule,
                anmeldungMoeglich: true,
                teilnahmerefs: [],
                kollegen: [],
                vertragDSGVOVorhanden: false,
            };

            const promise = firstValueFrom(effects.wettbewerbskontextGeladen$);

            action$.next(SchuleActions.wettbewerbskontextGeladen({ wettbewerbskontext }));

            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.schulkollegiumLaden({ schule }));
        });
    });

    describe('schulkollegiumLaden$', () => {
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

        const andereSchule: Schule = {
            kuerzel: 'S7654321',
            name: 'Waldschule',
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

        const schulkollegium: Schulkollegium = {
            kuerzel: 'S1234567',
            kollegium: ['Anna Johanna', 'Leo Lemma'],
        };

        const anderesSchulkollegium: Schulkollegium = {
            kuerzel: 'S7654321',
            kollegium: ['Fräulein Förster', 'Herr Greif'],
        };

        it('should call the httpService and map to schulkollegiumGeladen when successful', async () => {
            httpServiceMock.loadSchulkollegium.mockReturnValue(of(schulkollegium));

            const promise = firstValueFrom(effects.schulkollegiumLaden$);

            action$.next(SchuleActions.schulkollegiumLaden({ schule }));
            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.schulkollegiumGeladen({ schulkollegium }));
            expect(httpServiceMock.loadSchulkollegium).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulkollegium).toHaveBeenCalledWith('S1234567');
        });

        it('should switch to the latest action and cancel previous pending requests (switchMap)', () => {
            const httpFirst$ = new Subject<Schulkollegium>();
            const httpSecond$ = new Subject<Schulkollegium>();
            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadSchulkollegium
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.schulkollegiumLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                // Erste Anfrage bleibt zunächst offen.
                action$.next(SchuleActions.schulkollegiumLaden({ schule }));

                expect(httpServiceMock.loadSchulkollegium).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();

                // Eine weitere Action muss die erste Anfrage sofort abbestellen.
                action$.next(SchuleActions.schulkollegiumLaden({ schule: andereSchule }));

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadSchulkollegium).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadSchulkollegium).toHaveBeenLastCalledWith(andereSchule.kuerzel);

                // Eine verspätete Antwort der ersten Anfrage wird ignoriert.
                httpFirst$.next(schulkollegium);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                // Nur die Antwort der aktuellen Anfrage erzeugt eine Folgeaction.
                httpSecond$.next(anderesSchulkollegium);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchuleActions.schulkollegiumGeladen({ schulkollegium: anderesSchulkollegium }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to schulkollegiumLadenFailed when the httpService returns another Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadSchulkollegium.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.schulkollegiumLaden$);

            action$.next(SchuleActions.schulkollegiumLaden({ schule }));
            const emitted = await promise;

            expect(emitted).toEqual(SchuleActions.schulkollegiumLadenFailed({ error }));
            expect(httpServiceMock.loadSchulkollegium).toHaveBeenCalledOnce();
        });

        it('should keep the effect stream alive after an error occurred (catchError inside switchMap)', () => {
            const httpFirst$ = new Subject<Schulkollegium>();
            const httpSecond$ = new Subject<Schulkollegium>();

            httpServiceMock.loadSchulkollegium.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const onError = vi.fn();
            const onComplete = vi.fn();

            const subscription = effects.schulkollegiumLaden$.subscribe({
                next: action => emittedActions.push(action),
                error: onError,
                complete: onComplete,
            });

            try {
                action$.next(SchuleActions.schulkollegiumLaden({ schule }));
                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    SchuleActions.schulkollegiumLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);

                // Dieselbe Subscription muss weitere Actions verarbeiten.
                // Ein catchError außerhalb von switchMap würde bei Rückgabe
                // von of(failedAction) den gesamten Effect-Stream beenden.
                action$.next(SchuleActions.schulkollegiumLaden({ schule: andereSchule }));

                expect(httpServiceMock.loadSchulkollegium).toHaveBeenCalledTimes(2);

                httpSecond$.next(anderesSchulkollegium);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchuleActions.schulkollegiumLadenFailed({
                        error: httpServerErrorResponse,
                    }),
                    SchuleActions.schulkollegiumGeladen({ schulkollegium: anderesSchulkollegium }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('loadActionFailed$', () => {
        it('should publish the technical error message for an HttpErrorResponse', async () => {
            const promise = firstValueFrom(effects.loadActionFailed$);

            action$.next(SchuleActions.schulenLadenFailed({ error: httpServerErrorResponse }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
            expect(httpServiceMock.loadLehrpersonSchulen).not.toHaveBeenCalled();
            expect(httpServiceMock.loadSchulkollegium).not.toHaveBeenCalled();
        });

        it('should publish the technical error message for another Error', async () => {
            const error = new Error('uiuiui!');
            const promise = firstValueFrom(effects.loadActionFailed$);

            action$.next(SchuleActions.schulenLadenFailed({ error }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
            expect(httpServiceMock.loadLehrpersonSchulen).not.toHaveBeenCalled();
            expect(httpServiceMock.loadSchulkollegium).not.toHaveBeenCalled();
        });

        it('should publish the mapped error message for a forbidden response', async () => {
            const error = new HttpErrorResponse({
                status: 403,
                statusText: 'Forbidden',
            });
            const promise = firstValueFrom(effects.loadActionFailed$);

            action$.next(SchuleActions.schulenLadenFailed({ error }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Sie haben leider keine Berechtigung für diese Aktion'
            );
        });

        it('should be configured not to dispatch any action', () => {
            const metadata = getEffectsMetadata(effects);

            expect(metadata.loadActionFailed$?.dispatch).toBe(false);
        });

        it('should ignore unrelated actions', () => {
            const emittedActions: Action[] = [];
            const subscription = effects.loadActionFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchuleActions.schulenLaden());

                expect(emittedActions).toEqual([]);
                expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('wettbewerbsorganisationVerlassen$', () => {
        it('should navigate to lehrperson ', async () => {
            const promise = firstValueFrom(effects.wettbewerbsorganisationVerlassen$);

            action$.next(wettbewerbsorganisationVerlassen());

            await promise;

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'lehrperson']);
        });
    });
});
