import { HttpErrorResponse } from '@angular/common/http';
import { finalize, firstValueFrom, ReplaySubject, Subject, throwError } from 'rxjs';
import { SchulkatalogEffects } from './schulkatalog.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { SchulkatalogHttpService } from '../schulkatalog-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Land, LandMitOrtUndSchuleAnlegenRequest, Ort, Schule, Schulkuerzel } from '../../model/schulkatalog.model';
import { schulkatalogActions } from './schulkatalog.actions';
import { Action } from '@ngrx/store';

describe('SchulkatalogEffects', () => {
    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/authurls/login',
    });

    let action$: ReplaySubject<unknown>;
    let effects: SchulkatalogEffects;

    let httpServiceMock: {
        loadLaender: ReturnType<typeof vi.fn>;
        loadOrte: ReturnType<typeof vi.fn>;
        loadSchulen: ReturnType<typeof vi.fn>;
        landMitOrtUndSchuleAnlegen: ReturnType<typeof vi.fn>;
        ortMitSchuleInLandAnlegen: ReturnType<typeof vi.fn>;
        schuleInOrtAnlegen: ReturnType<typeof vi.fn>;
        schuleUmbenennen: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new ReplaySubject<unknown>(1);

        httpServiceMock = {
            loadLaender: vi.fn(),
            loadOrte: vi.fn(),
            loadSchulen: vi.fn(),
            landMitOrtUndSchuleAnlegen: vi.fn(),
            ortMitSchuleInLandAnlegen: vi.fn(),
            schuleInOrtAnlegen: vi.fn(),
            schuleUmbenennen: vi.fn(),
        };

        messagePublisherMock = {
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                SchulkatalogEffects,
                provideMockActions(() => action$),
                {
                    provide: SchulkatalogHttpService,
                    useValue: httpServiceMock,
                },
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
            ],
        });

        effects = TestBed.inject(SchulkatalogEffects);
    });

    describe('loadLaender$', () => {
        it('should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const treffer: Land[] = [{ kuerzel: 'CH', name: 'Schweiz', anzahlOrte: 17 }];

            const httpFirst$ = new Subject<Land[]>();
            const httpSecond$ = new Subject<Land[]>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadLaender
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            // Alle Emissionen des Effects in einem Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.loadLaender$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Erste Action triggern ---
            action$.next(schulkatalogActions.loadLaender());

            expect(httpServiceMock.loadLaender).toHaveBeenCalledTimes(1);
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // --- SCHRITT 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(schulkatalogActions.loadLaender());

            // BEWEIS 1: switchMap storniert den ersten Request sofort (finalize feuert)
            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadLaender).toHaveBeenCalledTimes(2);

            // --- SCHRITT 3: Verspätete Antwort des ZUERST abgebrochenen Requests simulieren ---
            httpFirst$.next(treffer);
            httpFirst$.complete();

            // BEWEIS 2: Das Array ist leer! treffer wurde wegen switchMap komplett ignoriert
            expect(emittedActions).toEqual([]);

            // --- SCHRITT 4: Antwort des zweiten (aktuellen) Requests simulieren ---
            httpSecond$.next(treffer);
            httpSecond$.complete();

            // BEWEIS 3: Nur die Action des zweiten Requests wurde emittiert
            expect(emittedActions).toEqual([schulkatalogActions.loadLaenderSucceeded({ laender: treffer })]);

            // Aufräumen
            subscription.unsubscribe();
        });
        it('should call the httpService and map to loadLaenderFailed when httpErrorResponse', async () => {
            httpServiceMock.loadLaender.mockReturnValue(throwError(() => httpServerErrorResponse));

            const emittedPromise = firstValueFrom(effects.loadLaender$);
            action$.next(schulkatalogActions.loadLaender());

            const emmited = await emittedPromise;
            expect(emmited).toEqual(schulkatalogActions.loadLaenderFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadLaender).toHaveBeenCalledOnce();
        });
        it('should call the httpService and map to loadLaenderFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadLaender.mockReturnValue(throwError(() => error));

            const emittedPromise = firstValueFrom(effects.loadLaender$);
            action$.next(schulkatalogActions.loadLaender());

            const emmited = await emittedPromise;
            expect(emmited).toEqual(schulkatalogActions.loadLaenderFailed({ error }));
            expect(httpServiceMock.loadLaender).toHaveBeenCalledOnce();
        });
        it('should keep the effect stream alive after an error occurred', () => {
            const erfolgreicheLaender: Land[] = [{ kuerzel: 'CH', name: 'Schweiz', anzahlOrte: 17 }];

            const httpFirst$ = new Subject<Land[]>();
            const httpSecond$ = new Subject<Land[]>();

            // 1. Request wirft einen Fehler, 2. Request ist erfolgreich
            httpServiceMock.loadLaender.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            // Alle Emissionen im Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.loadLaender$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(schulkatalogActions.loadLaender());

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // Überprüfen, ob die Failed-Action im Array gelandet ist
            expect(emittedActions).toEqual([schulkatalogActions.loadLaenderFailed({ error: httpServerErrorResponse })]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(schulkatalogActions.loadLaender());

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.loadLaender).toHaveBeenCalledTimes(2);

            // Zweiten Request erfolgreich beenden
            httpSecond$.next(erfolgreicheLaender);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogActions.loadLaenderFailed({ error: httpServerErrorResponse }),
                schulkatalogActions.loadLaenderSucceeded({ laender: erfolgreicheLaender }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });

    describe('landSelected$', () => {
        it('landSelected$ should map to loadOrte', async () => {
            const land: Land = {
                kuerzel: 'LAND-1',
                name: 'erstes Land',
                anzahlOrte: 154,
            };

            // arrange
            const emmitedPromise = firstValueFrom(effects.landSelected$);

            // act
            action$.next(schulkatalogActions.landSelected({ land }));

            // wait
            const emmited = await emmitedPromise;

            // assert
            expect(emmited).toEqual(schulkatalogActions.loadOrte({ land }));
        });
    });

    describe('loadOrte$', () => {
        const land1: Land = {
            kuerzel: 'LAND-1',
            name: 'erstes Land',
            anzahlOrte: 49,
        };
        const land2: Land = {
            kuerzel: 'LAND-2',
            name: 'zweites Land',
            anzahlOrte: 117,
        };

        const treffer1: Ort[] = [
            {
                land: land1,
                kuerzel: 'ORT-1',
                name: 'erster Ort',
                anzahlSchulen: 49,
            },
            {
                land: land1,
                kuerzel: 'ORT-2',
                name: 'zweiter Ort',
                anzahlSchulen: 117,
            },
        ];

        const treffer2: Ort[] = [
            {
                land: land2,
                kuerzel: 'ORT-3',
                name: 'dritter Ort',
                anzahlSchulen: 19,
            },
        ];
        it('should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const httpFirst$ = new Subject<Ort[]>();
            const httpSecond$ = new Subject<Ort[]>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadOrte
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            // Alle Emissionen des Effects in einem Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.loadOrte$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Erste Action triggern ---
            action$.next(schulkatalogActions.loadOrte({ land: land1 }));

            expect(httpServiceMock.loadOrte).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.loadOrte).toHaveBeenLastCalledWith('LAND-1');
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // --- SCHRITT 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(schulkatalogActions.loadOrte({ land: land2 }));

            // BEWEIS 1: switchMap storniert den ersten Request sofort (finalize feuert)
            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadOrte).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.loadOrte).toHaveBeenLastCalledWith('LAND-2');

            // --- SCHRITT 3: Verspätete Antwort des ZUERST abgebrochenen Requests simulieren ---
            httpFirst$.next(treffer1);
            httpFirst$.complete();

            // BEWEIS 2: Das Array ist leer! treffer1 wurde wegen switchMap komplett ignoriert
            expect(emittedActions).toEqual([]);

            // --- SCHRITT 4: Antwort des zweiten (aktuellen) Requests simulieren ---
            httpSecond$.next(treffer2);
            httpSecond$.complete();

            // BEWEIS 3: Nur die Action des zweiten Requests wurde emittiert
            expect(emittedActions).toEqual([schulkatalogActions.loadOrteSucceeded({ orte: treffer2 })]);

            // Aufräumen
            subscription.unsubscribe();
        });
        it('should call the httpService and map to loadOrteFailed when httpErrorResponse', async () => {
            httpServiceMock.loadOrte.mockReturnValue(throwError(() => httpServerErrorResponse));

            const emittedPromise = firstValueFrom(effects.loadOrte$);

            action$.next(schulkatalogActions.loadOrte({ land: land1 }));

            const emmited = await emittedPromise;

            expect(emmited).toEqual(schulkatalogActions.loadOrteFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadOrte).toHaveBeenCalledWith('LAND-1');
        });
        it('should call the httpService and map to loadOrteFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadOrte.mockReturnValue(throwError(() => error));

            const emittedPromise = firstValueFrom(effects.loadOrte$);

            action$.next(schulkatalogActions.loadOrte({ land: land1 }));

            const emmited = await emittedPromise;

            expect(emmited).toEqual(schulkatalogActions.loadOrteFailed({ error }));
            expect(httpServiceMock.loadOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadOrte).toHaveBeenCalledWith('LAND-1');
        });
        it('should keep the effect stream alive after an error occurred', () => {
            const erfolgreicheOrte: Ort[] = [{ land: land1, kuerzel: 'O-1', name: 'Ort 1', anzahlSchulen: 10 }];

            const httpFirst$ = new Subject<Ort[]>();
            const httpSecond$ = new Subject<Ort[]>();

            // 1. Request wirft einen Fehler, 2. Request ist erfolgreich
            httpServiceMock.loadOrte.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            // Alle Emissionen im Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.loadOrte$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(schulkatalogActions.loadOrte({ land: land1 }));

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // Überprüfen, ob die Failed-Action im Array gelandet ist
            expect(emittedActions).toEqual([schulkatalogActions.loadOrteFailed({ error: httpServerErrorResponse })]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(schulkatalogActions.loadOrte({ land: land1 }));

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.loadOrte).toHaveBeenCalledTimes(2);

            // Zweiten Request erfolgreich beenden
            httpSecond$.next(erfolgreicheOrte);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogActions.loadOrteFailed({ error: httpServerErrorResponse }),
                schulkatalogActions.loadOrteSucceeded({ orte: erfolgreicheOrte }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });

    describe('ortSelected$', async () => {
        it('ortSelected$ should map to loadSchulen', async () => {
            const ort: Ort = {
                land: {
                    kuerzel: 'LAND-1',
                    name: 'erstes Land',
                    anzahlOrte: 187,
                },
                kuerzel: 'ORT-1',
                name: 'erster Ort',
                anzahlSchulen: 42,
            };

            // arrange
            const emmitedPromise = firstValueFrom(effects.ortSelected$);

            // act
            action$.next(schulkatalogActions.ortSelected({ ort }));

            // wait
            const emmited = await emmitedPromise;

            // assert
            expect(emmited).toEqual(schulkatalogActions.loadSchulen({ ort }));
        });
    });

    describe('loadSchulen$', () => {
        const land: Land = {
            kuerzel: 'LAND-1',
            name: 'erstes Land',
            anzahlOrte: 49,
        };

        const ort1: Ort = {
            land: land,
            kuerzel: 'ORT-1',
            name: 'erster Ort',
            anzahlSchulen: 49,
        };

        const ort2: Ort = {
            land: land,
            kuerzel: 'ORT-2',
            name: 'zweiter Ort',
            anzahlSchulen: 5,
        };

        const treffer1: Schule[] = [
            {
                ort: ort1,
                kuerzel: 'SCHULE-1',
                name: 'erste Schule',
            },
            {
                ort: ort1,
                kuerzel: 'SCHULE-2',
                name: 'zweite Schule',
            },
        ];

        const treffer2: Schule[] = [
            {
                ort: ort2,
                kuerzel: 'SCHULE-3',
                name: 'dritte Schule',
            },
        ];
        it('should switch to the latest action and cancel previous pending requests (switchMap)', () => {
            const httpFirst$ = new Subject<Schule[]>();
            const httpSecond$ = new Subject<Schule[]>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadSchulen
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            // Alle Emissionen des Effects in einem Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.loadSchulen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Erste Action triggern ---
            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.loadSchulen).toHaveBeenLastCalledWith('ORT-1');
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // --- SCHRITT 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(schulkatalogActions.loadSchulen({ ort: ort2 }));

            // BEWEIS 1: switchMap storniert den ersten Request sofort (finalize feuert)
            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.loadSchulen).toHaveBeenLastCalledWith('ORT-2');

            // --- SCHRITT 3: Verspätete Antwort des ZUERST abgebrochenen Requests simulieren ---
            httpFirst$.next(treffer1);
            httpFirst$.complete();

            // BEWEIS 2: Das Array ist leer! treffer1 wurde wegen switchMap komplett ignoriert
            expect(emittedActions).toEqual([]);

            // --- SCHRITT 4: Antwort des zweiten (aktuellen) Requests simulieren ---
            httpSecond$.next(treffer2);
            httpSecond$.complete();

            // BEWEIS 3: Nur die Action des zweiten Requests wurde emittiert
            expect(emittedActions).toEqual([schulkatalogActions.loadSchulenSucceeded({ schulen: treffer2 })]);

            // Aufräumen
            subscription.unsubscribe();
        });
        it('should call the httpService and map to loadSchulenFailed when httpErrorResponse', async () => {
            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => httpServerErrorResponse));

            const emittedPromise = firstValueFrom(effects.loadSchulen$);

            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            const emmited = await emittedPromise;

            expect(emmited).toEqual(schulkatalogActions.loadSchulenFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith('ORT-1');
        });
        it('should call the httpService and map to loadSchulenFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => error));

            const emittedPromise = firstValueFrom(effects.loadSchulen$);

            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            const emmited = emittedPromise;

            expect(emmited).toEqual(schulkatalogActions.loadSchulenFailed({ error }));
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith('ORT-1');
        });
        it('should keep the effect stream alive after an error occurred', () => {
            const erfolgreicheSchulen: Schule[] = [{ ort: ort1, kuerzel: 'S1', name: 'Schule 1' }];

            const httpFirst$ = new Subject<Schule[]>();
            const httpSecond$ = new Subject<Schule[]>();

            // 1. Request wirft einen Fehler, 2. Request ist erfolgreich
            httpServiceMock.loadSchulen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            // Alle Emissionen im Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.loadSchulen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // Überprüfen, ob die Failed-Action im Array gelandet ist
            expect(emittedActions).toEqual([schulkatalogActions.loadSchulenFailed({ error: httpServerErrorResponse })]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(2);

            // Zweiten Request erfolgreich beenden
            httpSecond$.next(erfolgreicheSchulen);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogActions.loadSchulenFailed({ error: httpServerErrorResponse }),
                schulkatalogActions.loadSchulenSucceeded({ schulen: erfolgreicheSchulen }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });

    describe('landMitOrtUndSchuleAnlegen$', () => {
        const payload: LandMitOrtUndSchuleAnlegenRequest = {
            emailAuftraggeber: 'test@provider.de',
            kuerzelLand: 'TT',
            nameLand: 'Tatütata',
            nameOrt: 'Trallala',
            nameSchule: 'Trullerschule',
        };

        it('should ignore the second action while the first request is active (exhaustMap)', () => {
            const kuerzel: Schulkuerzel = { kuerzel: 'KUERZEL-1' };
            const httpFirst$ = new Subject<Schulkuerzel>();

            // nur der erste request muss gemocked werden (exhaustMap)
            httpServiceMock.landMitOrtUndSchuleAnlegen.mockReturnValueOnce(httpFirst$);

            const emittedActions: unknown[] = [];
            const subscription = effects.landMitOrtUndSchuleAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- ACTION 1: Erste Action triggern ---
            action$.next(schulkatalogActions.landMitOrtUndSchuleAnlegen({ payload: payload }));

            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenLastCalledWith(payload);

            // --- ACTION 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(schulkatalogActions.landMitOrtUndSchuleAnlegen({ payload: payload }));

            // Der Service darf trotz der zweiten Action NICHT noch einmal aufgerufen worden sein!
            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenCalledTimes(1);

            // --- Ersten Request erfolgreich beenden ---
            httpFirst$.next(kuerzel);
            httpFirst$.complete();

            // Es darf am Ende NUR die eine Erfolgs-Action der ERSTEN Operation existieren
            expect(emittedActions).toEqual([
                schulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded({ schulkuerzel: kuerzel }),
            ]);

            subscription.unsubscribe();
        });
    });
});
