import { finalize, firstValueFrom, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { SchulkatalogsucheEffects } from './schulkatalogsuche.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { SchulkatalogsucheHttpService } from '../schulkatalogsuche-http.service';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { schulkatalogsucheActions } from './schulkatalogsuche.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Action } from '@ngrx/store';

describe('SchulkatalogsucheEffects', () => {
    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/authurls/login',
    });

    let action$: ReplaySubject<unknown>;
    let effects: SchulkatalogsucheEffects;

    let httpServiceMock: {
        findOrte: ReturnType<typeof vi.fn>;
        loadSchulen: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new ReplaySubject<unknown>(1);

        httpServiceMock = {
            findOrte: vi.fn(),
            loadSchulen: vi.fn(),
        };

        messagePublisherMock = {
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                SchulkatalogsucheEffects,
                provideMockActions(() => action$),
                {
                    provide: SchulkatalogsucheHttpService,
                    useValue: httpServiceMock,
                },
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
            ],
        });

        effects = TestBed.inject(SchulkatalogsucheEffects);
    });

    describe('findOrte$', () => {
        const treffer1: Ort[] = [
            {
                kuerzel: 'ORT-1',
                name: 'erster Ort',
                land: {
                    kuerzel: 'DE-BY',
                    name: 'Bayern',
                    anzahlOrte: 19,
                },
                anzahlSchulen: 10,
            },
            {
                kuerzel: 'ORT-2',
                name: 'zweiter Ort',
                land: {
                    kuerzel: 'DE-HE',
                    name: 'Hessen',
                    anzahlOrte: 8,
                },
                anzahlSchulen: 5,
            },
        ];
        it('should call the httpService and map to findOrteSucceeded when normalized term has length 3 and search is successfull', async () => {
            const orte: Ort[] = [
                {
                    kuerzel: 'ORT-1',
                    name: 'erster Ort',
                    land: {
                        kuerzel: 'DE-BY',
                        name: 'Bayern',
                        anzahlOrte: 19,
                    },
                    anzahlSchulen: 10,
                },
                {
                    kuerzel: 'ORT-2',
                    name: 'zweiter Ort',
                    land: {
                        kuerzel: 'DE-HE',
                        name: 'Hessen',
                        anzahlOrte: 8,
                    },
                    anzahlSchulen: 5,
                },
            ];

            // arrange
            const name = '  ort';

            httpServiceMock.findOrte.mockReturnValue(of(orte));

            const emmitedPromise = firstValueFrom(effects.findOrte$);

            // act
            action$.next(schulkatalogsucheActions.findOrte({ name }));

            // wait
            const emmited = await emmitedPromise;

            // assert
            expect(emmited).toEqual(schulkatalogsucheActions.findOrteSucceeded({ orte }));
            expect(httpServiceMock.findOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.findOrte).toHaveBeenCalledWith('ort');
        });
        it('should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const treffer2: Ort[] = [
                {
                    kuerzel: 'ORT-3',
                    name: 'dritter Ort',
                    land: {
                        kuerzel: 'DE-HH',
                        name: 'Hamburg',
                        anzahlOrte: 1,
                    },
                    anzahlSchulen: 200,
                },
            ];

            const httpFirst$ = new Subject<Ort[]>();
            const httpSecond$ = new Subject<Ort[]>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.findOrte
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            // Alle Emissionen des Effects in einem Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.findOrte$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Erste Action triggern ---
            action$.next(schulkatalogsucheActions.findOrte({ name: 'zweiter Ort' }));

            expect(firstRequestFinalized).not.toHaveBeenCalled();
            expect(httpServiceMock.findOrte).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.findOrte).toHaveBeenLastCalledWith('zweiter Ort');

            // --- SCHRITT 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(schulkatalogsucheActions.findOrte({ name: 'erster' }));

            // BEWEIS 1: switchMap hat den ersten Request sofort abbestellt.
            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.findOrte).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.findOrte).toHaveBeenLastCalledWith('erster');

            // --- SCHRITT 3: Verspätete Antwort des ZUERST abgebrochenen Requests simulieren ---
            httpFirst$.next(treffer1);
            httpFirst$.complete();

            // BEWEIS 2: Das Array ist leer! treffer1 wurde wegen switchMap komplett ignoriert
            expect(emittedActions).toEqual([]);

            // --- SCHRITT 4: Antwort des zweiten (aktuellen) Requests simulieren ---
            httpSecond$.next(treffer2);
            httpSecond$.complete();

            // BEWEIS 3: Nur die Action des zweiten Requests wurde emittiert
            expect(emittedActions).toEqual([schulkatalogsucheActions.findOrteSucceeded({ orte: treffer2 })]);

            // Aufräumen
            subscription.unsubscribe();
        });
        it('should not call the httpService and map to orteCleared when normalized term has length 2', async () => {
            const name = ' or ';

            action$.next(schulkatalogsucheActions.findOrte({ name }));

            const emmited = await firstValueFrom(effects.findOrte$);
            expect(emmited).toEqual(schulkatalogsucheActions.orteCleared());
            expect(httpServiceMock.findOrte).not.toHaveBeenCalledOnce();
        });
        it('should call the httpService and map to findOrteFailed when httpErrorResponse', async () => {
            const name = 'ortname';

            httpServiceMock.findOrte.mockReturnValue(throwError(() => httpServerErrorResponse));
            action$.next(schulkatalogsucheActions.findOrte({ name }));

            const emmited = await firstValueFrom(effects.findOrte$);
            expect(emmited).toEqual(schulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.findOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.findOrte).toHaveBeenCalledWith(name);
        });
        it('should call the httpService and map to findOrteFailed when other Error', async () => {
            const name = 'ortname';
            const error = new Error('uiuiui!');

            httpServiceMock.findOrte.mockReturnValue(throwError(() => error));
            action$.next(schulkatalogsucheActions.findOrte({ name }));

            const emmited = await firstValueFrom(effects.findOrte$);
            expect(emmited).toEqual(schulkatalogsucheActions.findOrteFailed({ error }));
            expect(httpServiceMock.findOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.findOrte).toHaveBeenCalledWith(name);
        });
        it('should keep the effect stream alive after an error occurred', () => {
            const httpFirst$ = new Subject<Ort[]>();
            const httpSecond$ = new Subject<Ort[]>();

            // Erster Request wirft error, zweiter Request erfolgreich
            httpServiceMock.findOrte.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            // alle Emissionen in einem Array sammeln
            const emittedActions: Action[] = [];
            const subscription = effects.findOrte$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(schulkatalogsucheActions.findOrte({ name: 'Ort 1' }));

            // Fehler werfen (simuliert fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            expect(emittedActions).toEqual([
                schulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse }),
            ]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            action$.next(schulkatalogsucheActions.findOrte({ name: 'Ort-2}' }));

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.findOrte).toHaveBeenCalledTimes(2);

            // zweiten Request erfolgreich beenden
            httpSecond$.next(treffer1);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse }),
                schulkatalogsucheActions.findOrteSucceeded({ orte: treffer1 }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });

    describe('ortSelected$', () => {
        it('should map to loadSchulen', async () => {
            const ort: Ort = {
                kuerzel: 'ORT-2',
                name: 'zweiter Ort',
                land: {
                    kuerzel: 'DE-HE',
                    name: 'Hessen',
                    anzahlOrte: 8,
                },
                anzahlSchulen: 5,
            };

            // arrange
            const emittedPromise = firstValueFrom(effects.ortSelected$);

            // act
            action$.next(schulkatalogsucheActions.ortSelected({ ort }));

            // wait
            const emmited = await emittedPromise;

            // assert
            expect(emmited).toEqual(schulkatalogsucheActions.loadSchulen({ ort }));
        });
    });

    describe('loadSchulen$', () => {
        const ort1: Ort = {
            kuerzel: 'ORT-1',
            name: 'erster Ort',
            land: {
                kuerzel: 'DE-BY',
                name: 'Bayern',
                anzahlOrte: 19,
            },
            anzahlSchulen: 2,
        };

        const ort2: Ort = {
            kuerzel: 'ORT-2',
            name: 'zweiter Ort',
            land: {
                kuerzel: 'DE-SH',
                name: 'Schleswig-Holstein',
                anzahlOrte: 15,
            },
            anzahlSchulen: 2,
        };

        const schulenOrt1: Schule[] = [
            {
                ort: ort1,
                kuerzel: 'SCHULE-1',
                name: 'Neuhofschule',
            },
            {
                ort: ort1,
                kuerzel: 'SCHULE-2',
                name: 'Albert-Einstein-Schule',
            },
        ];

        const schulenOrt2: Schule[] = [
            {
                ort: ort2,
                kuerzel: 'SCHULE-3',
                name: 'Goetheschule',
            },
            {
                ort: ort2,
                kuerzel: 'SCHULE-4',
                name: 'Emmi-Noether-Schule',
            },
        ];

        it('should call the httpService and map to loadSchulenSucceeded when successfull', async () => {
            httpServiceMock.loadSchulen.mockReturnValue(of(schulenOrt1));
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort1 }));

            const emmited = await firstValueFrom(effects.loadSchulen$);
            expect(emmited).toEqual(
                schulkatalogsucheActions.loadSchulenSucceeded({ ortId: ort1.kuerzel, schulen: schulenOrt1 })
            );
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith(ort1.kuerzel);
        });
        it('should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
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
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort2 }));

            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.loadSchulen).toHaveBeenLastCalledWith(ort2.kuerzel);
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // --- SCHRITT 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort1 }));

            // BEWEIS 1: switchMap storniert den ersten Request sofort (finalize feuert)
            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.loadSchulen).toHaveBeenLastCalledWith(ort1.kuerzel);

            // --- SCHRITT 3: Verspätete Antwort des ZUERST abgebrochenen Requests simulieren ---
            httpFirst$.next(schulenOrt2);
            httpFirst$.complete();

            // BEWEIS 2: Das Array ist leer! treffer wurde wegen switchMap komplett ignoriert
            expect(emittedActions).toEqual([]);

            // --- SCHRITT 4: Antwort des zweiten (aktuellen) Requests simulieren ---
            httpSecond$.next(schulenOrt1);
            httpSecond$.complete();

            // BEWEIS 3: Nur die Action des zweiten Requests wurde emittiert
            expect(emittedActions).toEqual([
                schulkatalogsucheActions.loadSchulenSucceeded({
                    ortId: ort1.kuerzel,
                    schulen: schulenOrt1,
                }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
        it('should call the httpService and map to loadSchulenFailed when httpErrorResponse', async () => {
            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => httpServerErrorResponse));

            const emittedPromise = firstValueFrom(effects.loadSchulen$);
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort1 }));

            const emmited = await emittedPromise;
            expect(emmited).toEqual(schulkatalogsucheActions.loadSchulenFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith(ort1.kuerzel);
        });
        it('should call the httpService and map to loadSchulenFailed when other Error', async () => {
            const error = new Error('uiuiui!');
            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => error));
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort1 }));

            const emmited = await firstValueFrom(effects.loadSchulen$);
            expect(emmited).toEqual(schulkatalogsucheActions.loadSchulenFailed({ error }));
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith(ort1.kuerzel);
        });
        it('should keep the effect stream alive after an error occurred', () => {
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
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort1 }));

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // Überprüfen, ob die Failed-Action im Array gelandet ist
            expect(emittedActions).toEqual([
                schulkatalogsucheActions.loadSchulenFailed({ error: httpServerErrorResponse }),
            ]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort2 }));

            // BEWEIS 1: Der HTTP-Service muss trotz des vorherigen Fehlers ein zweites Mal gerufen werden!
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.loadSchulen).toHaveBeenLastCalledWith(ort2.kuerzel);

            // Zweiten Request erfolgreich beenden
            httpSecond$.next(schulenOrt2);
            httpSecond$.complete();

            // BEWEIS 2: Die Success-Action muss ebenfalls im Array landen!
            expect(emittedActions).toEqual([
                schulkatalogsucheActions.loadSchulenFailed({ error: httpServerErrorResponse }),
                schulkatalogsucheActions.loadSchulenSucceeded({ ortId: ort2.kuerzel, schulen: schulenOrt2 }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });
    describe('findOrteFailed$', () => {
        it('should trigger an error message and not dispatch any action', async () => {
            let effectTriggered = false;

            const subscription = effects.findOrteFailed$.subscribe(() => {
                effectTriggered = true;
            });

            action$.next(schulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse }));

            expect(httpServiceMock.findOrte).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);

            expect(effectTriggered).toBe(true);

            subscription.unsubscribe();
        });
    });
});
