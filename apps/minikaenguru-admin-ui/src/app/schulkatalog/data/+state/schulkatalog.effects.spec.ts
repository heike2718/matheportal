import { HttpErrorResponse } from '@angular/common/http';
import { finalize, firstValueFrom, Subject, throwError } from 'rxjs';
import { SchulkatalogEffects } from './schulkatalog.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { SchulkatalogHttpService } from '../schulkatalog-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import {
    Land,
    LandMitOrtUndSchuleAnlegenRequest,
    Ort,
    OrtMitSchuleAnlegenRequest,
    Schule,
    SchuleAnlegenOderAendernRequest,
    Schulkuerzel,
    SCHULKATALOG_ADMIN_KONTEXT,
} from '../../model/schulkatalog.model';
import { schulkatalogActions } from './schulkatalog.actions';
import { Action } from '@ngrx/store';

describe('SchulkatalogEffects', () => {
    const schulkuerzel: Schulkuerzel = { kuerzel: 'KUERZEL-1' };

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

    let messagePublisherMock: { publishInfo: ReturnType<typeof vi.fn>; publishError: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

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
            publishInfo: vi.fn(),
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
        it('should call the httpService and map to loadActionFailed when httpErrorResponse', async () => {
            httpServiceMock.loadLaender.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.loadLaender$);

            action$.next(schulkatalogActions.loadLaender());
            const emmited = await promise;

            expect(emmited).toEqual(
                schulkatalogActions.loadActionFailed({
                    kontext: SCHULKATALOG_ADMIN_KONTEXT.laender,
                    error: httpServerErrorResponse,
                })
            );
            expect(httpServiceMock.loadLaender).toHaveBeenCalledOnce();
        });
        it('should call the httpService and map to loadActionFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadLaender.mockReturnValue(throwError(() => error));

            const emittedPromise = firstValueFrom(effects.loadLaender$);
            action$.next(schulkatalogActions.loadLaender());

            const emmited = await emittedPromise;
            expect(emmited).toEqual(
                schulkatalogActions.loadActionFailed({ kontext: SCHULKATALOG_ADMIN_KONTEXT.laender, error })
            );
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
            expect(emittedActions).toEqual([
                schulkatalogActions.loadActionFailed({
                    kontext: SCHULKATALOG_ADMIN_KONTEXT.laender,
                    error: httpServerErrorResponse,
                }),
            ]);

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
                schulkatalogActions.loadActionFailed({
                    kontext: SCHULKATALOG_ADMIN_KONTEXT.laender,
                    error: httpServerErrorResponse,
                }),
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
            const promise = firstValueFrom(effects.landSelected$);

            // act
            action$.next(schulkatalogActions.landSelected({ land }));
            const emmited = await promise;

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
        it('should call the httpService and map to loadActionFailed when httpErrorResponse', async () => {
            httpServiceMock.loadOrte.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.loadOrte$);

            action$.next(schulkatalogActions.loadOrte({ land: land1 }));
            const emmited = await promise;

            expect(emmited).toEqual(
                schulkatalogActions.loadActionFailed({
                    kontext: SCHULKATALOG_ADMIN_KONTEXT.orte,
                    error: httpServerErrorResponse,
                })
            );
            expect(httpServiceMock.loadOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadOrte).toHaveBeenCalledWith('LAND-1');
        });
        it('should call the httpService and map to loadActionFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadOrte.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.loadOrte$);

            action$.next(schulkatalogActions.loadOrte({ land: land1 }));
            const emmited = await promise;

            expect(emmited).toEqual(
                schulkatalogActions.loadActionFailed({ kontext: SCHULKATALOG_ADMIN_KONTEXT.orte, error })
            );
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
            expect(emittedActions).toEqual([
                schulkatalogActions.loadActionFailed({
                    kontext: SCHULKATALOG_ADMIN_KONTEXT.orte,
                    error: httpServerErrorResponse,
                }),
            ]);

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
                schulkatalogActions.loadActionFailed({
                    kontext: SCHULKATALOG_ADMIN_KONTEXT.orte,
                    error: httpServerErrorResponse,
                }),
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
        it('should call the httpService and map to loadActionFailed when httpErrorResponse', async () => {
            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.loadSchulen$);

            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));
            const emmited = await promise;

            expect(emmited).toEqual(
                schulkatalogActions.loadActionFailed({
                    kontext: SCHULKATALOG_ADMIN_KONTEXT.schulen,
                    error: httpServerErrorResponse,
                })
            );
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith('ORT-1');
        });
        it('should call the httpService and map to loadActionFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.loadSchulen$);

            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));
            const emitted = await promise;

            expect(emitted).toEqual(
                schulkatalogActions.loadActionFailed({ kontext: SCHULKATALOG_ADMIN_KONTEXT.schulen, error })
            );
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith('ORT-1');
        });
        it('should keep the effect stream alive after an error occurred', () => {
            const erfolgreicheSchulen: Schule[] = [{ ort: ort1, kuerzel: 'S1', name: 'Schule 1' }];

            const httpFirst$ = new Subject<Schule[]>();
            const httpSecond$ = new Subject<Schule[]>();

            const firstRequestFinalized = vi.fn();
            const secondRequestFinalized = vi.fn();

            // 1. Request wirft einen Fehler, 2. Request ist erfolgreich
            httpServiceMock.loadSchulen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            // Alle Emissionen im Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.loadSchulen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.loadSchulen).toHaveBeenLastCalledWith(ort1.kuerzel);
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // Überprüfen, ob die Failed-Action im Array gelandet ist
            expect(emittedActions).toEqual([
                schulkatalogActions.loadActionFailed({
                    kontext: SCHULKATALOG_ADMIN_KONTEXT.schulen,
                    error: httpServerErrorResponse,
                }),
            ]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(2);
            expect(secondRequestFinalized).not.toHaveBeenCalled();

            // Zweiten Request erfolgreich beenden
            httpSecond$.next(erfolgreicheSchulen);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogActions.loadActionFailed({
                    kontext: SCHULKATALOG_ADMIN_KONTEXT.schulen,
                    error: httpServerErrorResponse,
                }),
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
            const httpFirst$ = new Subject<Schulkuerzel>();

            // nur der erste request muss gemocked werden (exhaustMap)
            httpServiceMock.landMitOrtUndSchuleAnlegen.mockReturnValueOnce(httpFirst$);

            const emittedActions: Action[] = [];
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
            httpFirst$.next(schulkuerzel);
            httpFirst$.complete();

            // Es darf am Ende NUR die eine Erfolgs-Action der ERSTEN Operation existieren
            expect(emittedActions).toEqual([schulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded({ schulkuerzel })]);

            subscription.unsubscribe();
        });
        it('should call the httpService and map to actionFailed when httpErrorResponse', async () => {
            httpServiceMock.landMitOrtUndSchuleAnlegen.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.landMitOrtUndSchuleAnlegen$);

            action$.next(schulkatalogActions.landMitOrtUndSchuleAnlegen({ payload }));
            const emmited = await promise;

            expect(emmited).toEqual(schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }));

            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenCalledOnce();
            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenCalledWith(payload);
        });
        it('should call the httpService and map to actionFailed when an other error is thrown', async () => {
            const error = new Error('uiuiui');

            httpServiceMock.landMitOrtUndSchuleAnlegen.mockReturnValueOnce(throwError(() => error));

            const promise = firstValueFrom(effects.landMitOrtUndSchuleAnlegen$);

            action$.next(schulkatalogActions.landMitOrtUndSchuleAnlegen({ payload }));
            const emmited = await promise;

            expect(emmited).toEqual(schulkatalogActions.changeActionFailed({ error }));

            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenCalledOnce();
            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenCalledWith(payload);
        });

        it('should keep the effect stream alive after an error occurred', () => {
            const httpFirst$ = new Subject<Schulkuerzel>();
            const httpSecond$ = new Subject<Schulkuerzel>();

            // 1. Request wirft einen Fehler, 2. Request ist erfolgreich
            httpServiceMock.landMitOrtUndSchuleAnlegen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            // Alle Emissionen im Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.landMitOrtUndSchuleAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(schulkatalogActions.landMitOrtUndSchuleAnlegen({ payload: payload }));

            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenLastCalledWith(payload);

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // Überprüfen, ob die Failed-Action im Array gelandet ist
            expect(emittedActions).toEqual([
                schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }),
            ]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(schulkatalogActions.landMitOrtUndSchuleAnlegen({ payload: payload }));

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.landMitOrtUndSchuleAnlegen).toHaveBeenCalledTimes(2);

            // Zweiten Request erfolgreich beenden
            httpSecond$.next(schulkuerzel);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }),
                schulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded({ schulkuerzel }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });

    describe('landMitOrtUndSchuleAnlegenSucceeded$', () => {
        it('should show a message and dispatch loadLaender', async () => {
            const promise = firstValueFrom(effects.landMitOrtUndSchuleAnlegenSucceeded$);

            action$.next(schulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded({ schulkuerzel }));
            const emitted = await promise;

            expect(messagePublisherMock.publishInfo).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishInfo).toHaveBeenCalledWith('Neue Schule angelegt. Kürzel: KUERZEL-1');
            expect(emitted).toEqual(schulkatalogActions.loadLaender());
        });
    });

    describe('ortMitSchuleAnlegen$', () => {
        const land: Land = {
            kuerzel: 'TT',
            name: 'Tickitacki-Land',
            anzahlOrte: 17,
        };

        const payload: OrtMitSchuleAnlegenRequest = {
            emailAuftraggeber: 'test@provider.de',
            nameOrt: 'Trallala',
            nameSchule: 'Trullerschule',
        };

        it('should ignore the second action while the first request is active (exhaustMap)', () => {
            const httpFirst$ = new Subject<Schulkuerzel>();

            // nur der erste request muss gemocked werden (exhaustMap)
            httpServiceMock.ortMitSchuleInLandAnlegen.mockReturnValueOnce(httpFirst$);

            const emittedActions: Action[] = [];
            const subscription = effects.ortMitSchuleAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- ACTION 1: Erste Action triggern ---
            action$.next(schulkatalogActions.ortMitSchuleAnlegen({ land, payload }));

            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenLastCalledWith('TT', payload);

            // --- ACTION 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(schulkatalogActions.ortMitSchuleAnlegen({ land, payload }));

            // Der Service darf trotz der zweiten Action NICHT noch einmal aufgerufen worden sein!
            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenCalledTimes(1);

            // --- Ersten Request erfolgreich beenden ---
            httpFirst$.next(schulkuerzel);
            httpFirst$.complete();

            // Es darf am Ende NUR die eine Erfolgs-Action der ERSTEN Operation existieren
            expect(emittedActions).toEqual([schulkatalogActions.ortMitSchuleAnlegenSucceeded({ land, schulkuerzel })]);

            subscription.unsubscribe();
        });
        it('should call the httpService and map to actionFailed when httpErrorResponse', async () => {
            httpServiceMock.ortMitSchuleInLandAnlegen.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.ortMitSchuleAnlegen$);

            action$.next(schulkatalogActions.ortMitSchuleAnlegen({ land, payload }));
            const emmited = await promise;

            expect(emmited).toEqual(schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenCalledOnce();
            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenCalledWith('TT', payload);
        });
        it('should call the httpService and map to actionFailed when an other error is thrown', async () => {
            const error = new Error('uiuiui');

            httpServiceMock.ortMitSchuleInLandAnlegen.mockReturnValueOnce(throwError(() => error));

            const promise = firstValueFrom(effects.ortMitSchuleAnlegen$);

            action$.next(schulkatalogActions.ortMitSchuleAnlegen({ land, payload }));
            const emmited = await promise;

            expect(emmited).toEqual(schulkatalogActions.changeActionFailed({ error }));
            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenCalledOnce();
            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenCalledWith('TT', payload);
        });

        it('should keep the effect stream alive after an error occurred', () => {
            const httpFirst$ = new Subject<Schulkuerzel>();
            const httpSecond$ = new Subject<Schulkuerzel>();

            // 1. Request wirft einen Fehler, 2. Request ist erfolgreich
            httpServiceMock.ortMitSchuleInLandAnlegen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            // Alle Emissionen im Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.ortMitSchuleAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(schulkatalogActions.ortMitSchuleAnlegen({ land, payload }));

            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenLastCalledWith('TT', payload);

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // Überprüfen, ob die Failed-Action im Array gelandet ist
            expect(emittedActions).toEqual([
                schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }),
            ]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(schulkatalogActions.ortMitSchuleAnlegen({ land, payload }));

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.ortMitSchuleInLandAnlegen).toHaveBeenLastCalledWith('TT', payload);

            // Zweiten Request erfolgreich beenden
            httpSecond$.next(schulkuerzel);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }),
                schulkatalogActions.ortMitSchuleAnlegenSucceeded({ land, schulkuerzel: schulkuerzel }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });

    describe('ortMitSchuleAnlegenSucceeded$', () => {
        it('should show a message and dispatch loadOrte', async () => {
            const land: Land = {
                kuerzel: 'TT',
                name: 'Takatukaland',
                anzahlOrte: 8,
            };

            const promise = firstValueFrom(effects.ortMitSchuleAnlegenSucceeded$);

            action$.next(schulkatalogActions.ortMitSchuleAnlegenSucceeded({ land, schulkuerzel }));
            const emitted = await promise;

            expect(messagePublisherMock.publishInfo).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishInfo).toHaveBeenCalledWith('Neue Schule angelegt. Kürzel: KUERZEL-1');
            expect(emitted).toEqual(schulkatalogActions.loadOrte({ land }));
        });
    });

    describe('schuleAnlegen$', () => {
        const ort: Ort = {
            land: {
                kuerzel: 'TT',
                name: 'Takatukaland',
                anzahlOrte: 6,
            },
            kuerzel: 'A1234567',
            name: 'Testort',
            anzahlSchulen: 52,
        };

        const payload: SchuleAnlegenOderAendernRequest = {
            emailAuftraggeber: 'test@provider.de',
            name: 'Trillerschule',
        };

        it('should ignore the second action while the first request is active (exhaustMap)', () => {
            const httpFirst$ = new Subject<Schulkuerzel>();

            // nur der erste request muss gemocked werden (exhaustMap)
            httpServiceMock.schuleInOrtAnlegen.mockReturnValueOnce(httpFirst$);

            const emittedActions: Action[] = [];
            const subscription = effects.schuleAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- ACTION 1: Erste Action triggern ---
            action$.next(schulkatalogActions.schuleAnlegen({ ort, payload }));

            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenLastCalledWith('A1234567', payload);

            // --- ACTION 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(schulkatalogActions.schuleAnlegen({ ort, payload }));

            // Der Service darf trotz der zweiten Action NICHT noch einmal aufgerufen worden sein!
            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenCalledTimes(1);

            // --- Ersten Request erfolgreich beenden ---
            httpFirst$.next(schulkuerzel);
            httpFirst$.complete();

            // Es darf am Ende NUR die eine Erfolgs-Action der ERSTEN Operation existieren
            expect(emittedActions).toEqual([schulkatalogActions.schuleAnlegenSucceeded({ ort, schulkuerzel })]);

            subscription.unsubscribe();
        });
        it('should call the httpService and map to actionFailed when httpErrorResponse', async () => {
            httpServiceMock.schuleInOrtAnlegen.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.schuleAnlegen$);

            action$.next(schulkatalogActions.schuleAnlegen({ ort, payload }));
            const emmited = await promise;

            expect(emmited).toEqual(schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenCalledOnce();
            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenCalledWith('A1234567', payload);
        });
        it('should call the httpService and map to actionFailed when an other error is thrown', async () => {
            const error = new Error('uiuiui');

            httpServiceMock.schuleInOrtAnlegen.mockReturnValueOnce(throwError(() => error));

            const emittedPromise = firstValueFrom(effects.schuleAnlegen$);

            action$.next(schulkatalogActions.schuleAnlegen({ ort, payload }));

            const emmited = await emittedPromise;

            expect(emmited).toEqual(schulkatalogActions.changeActionFailed({ error }));
            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenCalledOnce();
            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenCalledWith('A1234567', payload);
        });

        it('should keep the effect stream alive after an error occurred', () => {
            const httpFirst$ = new Subject<Schulkuerzel>();
            const httpSecond$ = new Subject<Schulkuerzel>();

            // 1. Request wirft einen Fehler, 2. Request ist erfolgreich
            httpServiceMock.schuleInOrtAnlegen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            // Alle Emissionen im Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.schuleAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(schulkatalogActions.schuleAnlegen({ ort, payload }));

            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenLastCalledWith('A1234567', payload);

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // Überprüfen, ob die Failed-Action im Array gelandet ist
            expect(emittedActions).toEqual([
                schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }),
            ]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(schulkatalogActions.schuleAnlegen({ ort, payload }));

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.schuleInOrtAnlegen).toHaveBeenLastCalledWith('A1234567', payload);

            // Zweiten Request erfolgreich beenden
            httpSecond$.next(schulkuerzel);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }),
                schulkatalogActions.schuleAnlegenSucceeded({ ort, schulkuerzel }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });

    describe('schuleAnlegenSucceeded$', () => {
        it('should show a message and dispatch loadOrte', async () => {
            const land: Land = {
                kuerzel: 'TT',
                name: 'Takatukaland',
                anzahlOrte: 8,
            };

            const ort: Ort = {
                land,
                kuerzel: 'A1234567',
                name: 'Testort',
                anzahlSchulen: 34,
            };

            const promise = firstValueFrom(effects.schuleAnlegenSucceeded$);

            action$.next(schulkatalogActions.schuleAnlegenSucceeded({ ort, schulkuerzel }));
            const emitted = await promise;

            expect(messagePublisherMock.publishInfo).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishInfo).toHaveBeenCalledWith('Neue Schule angelegt. Kürzel: KUERZEL-1');
            expect(emitted).toEqual(schulkatalogActions.loadSchulen({ ort }));
        });
    });

    describe('schuleUmbenennen$', () => {
        const ort: Ort = {
            land: {
                kuerzel: 'TT',
                name: 'Takatukaland',
                anzahlOrte: 6,
            },
            kuerzel: 'A1234567',
            name: 'Testort',
            anzahlSchulen: 52,
        };

        const schule: Schule = {
            ort,
            kuerzel: 'Z7654321',
            name: 'Alter Name',
        };

        const payload: SchuleAnlegenOderAendernRequest = {
            emailAuftraggeber: 'test@provider.de',
            name: 'Trillerschule',
        };

        it('should ignore the second action while the first request is active (exhaustMap)', () => {
            const httpFirst$ = new Subject<Schulkuerzel>();

            // nur der erste request muss gemocked werden (exhaustMap)
            httpServiceMock.schuleUmbenennen.mockReturnValueOnce(httpFirst$);

            const emittedActions: Action[] = [];
            const subscription = effects.schuleUmbenennen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- ACTION 1: Erste Action triggern ---
            action$.next(schulkatalogActions.schuleUmbenennen({ schule, payload }));

            expect(httpServiceMock.schuleUmbenennen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.schuleUmbenennen).toHaveBeenLastCalledWith(schule.kuerzel, payload);

            // --- ACTION 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(schulkatalogActions.schuleUmbenennen({ schule, payload }));

            // Der Service darf trotz der zweiten Action NICHT noch einmal aufgerufen worden sein!
            expect(httpServiceMock.schuleUmbenennen).toHaveBeenCalledTimes(1);

            // --- Ersten Request erfolgreich beenden ---
            httpFirst$.next(schulkuerzel);
            httpFirst$.complete();

            // Es darf am Ende NUR die eine Erfolgs-Action der ERSTEN Operation existieren
            expect(emittedActions).toEqual([schulkatalogActions.schuleUmbenennenSucceeded({ schule, schulkuerzel })]);

            subscription.unsubscribe();
        });
        it('should call the httpService and map to actionFailed when httpErrorResponse', async () => {
            httpServiceMock.schuleUmbenennen.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.schuleUmbenennen$);

            action$.next(schulkatalogActions.schuleUmbenennen({ schule, payload }));
            const emmited = await promise;

            expect(emmited).toEqual(schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.schuleUmbenennen).toHaveBeenCalledOnce();
            expect(httpServiceMock.schuleUmbenennen).toHaveBeenCalledWith(schule.kuerzel, payload);
        });
        it('should call the httpService and map to actionFailed when an other error is thrown', async () => {
            const error = new Error('uiuiui');

            httpServiceMock.schuleUmbenennen.mockReturnValueOnce(throwError(() => error));

            const promise = firstValueFrom(effects.schuleUmbenennen$);

            action$.next(schulkatalogActions.schuleUmbenennen({ schule, payload }));
            const emmited = await promise;

            expect(emmited).toEqual(schulkatalogActions.changeActionFailed({ error }));
            expect(httpServiceMock.schuleUmbenennen).toHaveBeenCalledOnce();
            expect(httpServiceMock.schuleUmbenennen).toHaveBeenCalledWith(schule.kuerzel, payload);
        });

        it('should keep the effect stream alive after an error occurred', () => {
            const httpFirst$ = new Subject<Schulkuerzel>();
            const httpSecond$ = new Subject<Schulkuerzel>();

            // 1. Request wirft einen Fehler, 2. Request ist erfolgreich
            httpServiceMock.schuleUmbenennen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            // Alle Emissionen im Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.schuleUmbenennen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(schulkatalogActions.schuleUmbenennen({ schule, payload }));

            expect(httpServiceMock.schuleUmbenennen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.schuleUmbenennen).toHaveBeenLastCalledWith(schule.kuerzel, payload);

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // Überprüfen, ob die Failed-Action im Array gelandet ist
            expect(emittedActions).toEqual([
                schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }),
            ]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(schulkatalogActions.schuleUmbenennen({ schule, payload }));

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.schuleUmbenennen).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.schuleUmbenennen).toHaveBeenLastCalledWith(schule.kuerzel, payload);

            // Zweiten Request erfolgreich beenden
            httpSecond$.next(schulkuerzel);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }),
                schulkatalogActions.schuleUmbenennenSucceeded({ schule, schulkuerzel }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });

    describe('schuleUmbenennenSucceeded$', () => {
        it('should show a message and dispatch loadOrte', async () => {
            const land: Land = {
                kuerzel: 'TT',
                name: 'Takatukaland',
                anzahlOrte: 8,
            };

            const ort: Ort = {
                land,
                kuerzel: 'A1234567',
                name: 'Testort',
                anzahlSchulen: 34,
            };

            const schule: Schule = {
                ort,
                kuerzel: 'KUERZEL_1',
                name: 'Neue Baumschule',
            };

            const promise = firstValueFrom(effects.schuleUmbenennenSucceeded$);

            action$.next(schulkatalogActions.schuleUmbenennenSucceeded({ schule, schulkuerzel }));
            const emitted = await promise;

            expect(messagePublisherMock.publishInfo).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishInfo).toHaveBeenCalledWith(
                'Schule erfolgreich umbenannt. Kürzel: KUERZEL-1'
            );
            expect(emitted).toEqual(schulkatalogActions.loadSchulen({ ort }));
        });
    });

    describe('changeActionFailed$', () => {
        it('should trigger an error message and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.actionFailed$);

            action$.next(schulkatalogActions.changeActionFailed({ error: httpServerErrorResponse }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
        });
    });

    describe('loadActionFailed$', () => {
        it.each([
            SCHULKATALOG_ADMIN_KONTEXT.laender,
            SCHULKATALOG_ADMIN_KONTEXT.orte,
            SCHULKATALOG_ADMIN_KONTEXT.schulen,
        ])('should trigger an error message and not dispatch any action on load with Kontext %s', async kontext => {
            const promise = firstValueFrom(effects.actionFailed$);

            action$.next(schulkatalogActions.loadActionFailed({ kontext, error: httpServerErrorResponse }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
        });
    });
});
