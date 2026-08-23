import { HttpErrorResponse } from '@angular/common/http';
import { finalize, firstValueFrom, last, ReplaySubject, Subject, throwError } from 'rxjs';
import { SchulkatalogEffects } from './schulkatalog.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { SchulkatalogHttpService } from '../schulkatalog-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { schulkatalogActions } from './schulkatalog.actions';

describe('SchulkatalogEffects', () => {
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
    let effects: SchulkatalogEffects;

    let httpServiceMock: {
        loadLaender: ReturnType<typeof vi.fn>;
        loadOrte: ReturnType<typeof vi.fn>;
        loadSchulen: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new ReplaySubject<unknown>(1);

        httpServiceMock = {
            loadLaender: vi.fn(),
            loadOrte: vi.fn(),
            loadSchulen: vi.fn(),
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
        it('loadLaender$ should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const treffer1: Land[] = [
                {
                    kuerzel: 'LAND-1',
                    name: 'erstes Land',
                    anzahlOrte: 49,
                },
                {
                    kuerzel: 'LAND-2',
                    name: 'zweites Land',
                    anzahlOrte: 117,
                },
            ];

            const treffer2: Land[] = [
                {
                    kuerzel: 'LAND-3',
                    name: 'drittes Land',
                    anzahlOrte: 233,
                },
            ];

            const httpFirst$ = new Subject<Land[]>();
            const httpSecond$ = new Subject<Land[]>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadLaender
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            // effect abonnieren
            const emittedPromise = firstValueFrom(effects.loadLaender$);

            // effect bekommt die erste action mit Rückgabe httpFirst$
            action$.next(schulkatalogActions.loadLaender());

            // switchMap abonniert httpFirst$ request läuft
            expect(httpServiceMock.loadLaender).toHaveBeenCalledTimes(1);
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // effect bekommt die zweite action, während der erste request noch läuf
            action$.next(schulkatalogActions.loadLaender());

            // switchMap hat den ersten Request sofort abbestellt.
            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadLaender).toHaveBeenCalledTimes(2);

            // Verspätete Antwort des ersten Requests simulieren.
            // Sie darf den Effect nicht mehr erreichen.
            httpFirst$.next(treffer1);
            httpFirst$.complete();

            // Antwort des zweiten Requests simulieren.
            httpSecond$.next(treffer2);
            httpSecond$.complete();

            await expect(emittedPromise).resolves.toEqual(
                schulkatalogActions.loadLaenderSucceeded({
                    laender: treffer2,
                })
            );
        });
        it('loadLaender$ should call the httpService and map to loadLaenderFailed when httpErrorResponse', async () => {
            httpServiceMock.loadLaender.mockReturnValue(throwError(() => httpServerErrorResponse));
            action$.next(schulkatalogActions.loadLaender());

            const emmited = await firstValueFrom(effects.loadLaender$);
            expect(emmited).toEqual(schulkatalogActions.loadLaenderFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadLaender).toHaveBeenCalledOnce();
        });
        it('findOrte$ should call the httpService and map to loadLaenderFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadLaender.mockReturnValue(throwError(() => error));
            action$.next(schulkatalogActions.loadLaender());

            const emmited = await firstValueFrom(effects.loadLaender$);
            expect(emmited).toEqual(schulkatalogActions.loadLaenderFailed({ error }));
            expect(httpServiceMock.loadLaender).toHaveBeenCalledOnce();
        });
    });

    describe('landSelected$', async () => {
        it('landSelected$ should map to loadOrte', async () => {
            const land: Land = {
                kuerzel: 'LAND-1',
                name: 'erstes Land',
                anzahlOrte: 154,
            };

            action$.next(schulkatalogActions.landSelected({ land }));

            const emmited = await firstValueFrom(effects.landSelected$);
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
        it('loadOrte$ should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const httpFirst$ = new Subject<Ort[]>();
            const httpSecond$ = new Subject<Ort[]>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadOrte
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            // effect abonnieren
            const emittedPromise = firstValueFrom(effects.loadOrte$);

            // effect bekommt die erste action mit Rückgabe httpFirst$
            action$.next(schulkatalogActions.loadOrte({ land: land1 }));

            // switchMap abonniert httpFirst$ request läuft
            expect(httpServiceMock.loadOrte).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.loadOrte).toHaveBeenCalledWith('LAND-1');
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // effect bekommt die zweite action, während der erste request noch läuf
            action$.next(schulkatalogActions.loadOrte({ land: land2 }));

            // switchMap hat den ersten Request sofort abbestellt.
            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadOrte).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.loadOrte).toHaveBeenCalledWith('LAND-2');

            // Verspätete Antwort des ersten Requests simulieren.
            // Sie darf den Effect nicht mehr erreichen.
            httpFirst$.next(treffer1);
            httpFirst$.complete();

            // Antwort des zweiten Requests simulieren.
            httpSecond$.next(treffer2);
            httpSecond$.complete();

            await expect(emittedPromise).resolves.toEqual(
                schulkatalogActions.loadOrteSucceeded({
                    orte: treffer2,
                })
            );
        });
        it('loadOrte$ should call the httpService and map to loadOrteFailed when httpErrorResponse', async () => {
            httpServiceMock.loadOrte.mockReturnValue(throwError(() => httpServerErrorResponse));
            action$.next(schulkatalogActions.loadOrte({ land: land1 }));

            const emmited = await firstValueFrom(effects.loadOrte$);
            expect(emmited).toEqual(schulkatalogActions.loadOrteFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadOrte).toHaveBeenCalledWith('LAND-1');
        });
        it('loadOrte$ should call the httpService and map to loadOrteFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadOrte.mockReturnValue(throwError(() => error));
            action$.next(schulkatalogActions.loadOrte({ land: land1 }));

            const emmited = await firstValueFrom(effects.loadOrte$);
            expect(emmited).toEqual(schulkatalogActions.loadOrteFailed({ error }));
            expect(httpServiceMock.loadOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadOrte).toHaveBeenCalledWith('LAND-1');
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

            action$.next(schulkatalogActions.ortSelected({ ort }));

            const emmited = await firstValueFrom(effects.ortSelected$);
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
        it('loadSchulen$ should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const httpFirst$ = new Subject<Schule[]>();
            const httpSecond$ = new Subject<Schule[]>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadSchulen
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            // effect abonnieren
            const emittedPromise = firstValueFrom(effects.loadSchulen$);

            // effect bekommt die erste action mit Rückgabe httpFirst$
            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            // switchMap abonniert httpFirst$ request läuft
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith('ORT-1');
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // effect bekommt die zweite action, während der erste request noch läuf
            action$.next(schulkatalogActions.loadSchulen({ ort: ort2 }));

            // switchMap hat den ersten Request sofort abbestellt.
            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith('ORT-2');

            // Verspätete Antwort des ersten Requests simulieren.
            // Sie darf den Effect nicht mehr erreichen.
            httpFirst$.next(treffer1);
            httpFirst$.complete();

            // Antwort des zweiten Requests simulieren.
            httpSecond$.next(treffer2);
            httpSecond$.complete();

            await expect(emittedPromise).resolves.toEqual(
                schulkatalogActions.loadSchulenSucceeded({
                    schulen: treffer2,
                })
            );
        });
        it('loadSchulen$ should call the httpService and map to loadSchulenFailed when httpErrorResponse', async () => {
            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => httpServerErrorResponse));
            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            const emmited = await firstValueFrom(effects.loadSchulen$);
            expect(emmited).toEqual(schulkatalogActions.loadSchulenFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith('ORT-1');
        });
        it('loadOrte$ should call the httpService and map to loadOrteFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => error));
            action$.next(schulkatalogActions.loadSchulen({ ort: ort1 }));

            const emmited = await firstValueFrom(effects.loadSchulen$);
            expect(emmited).toEqual(schulkatalogActions.loadSchulenFailed({ error }));
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith('ORT-1');
        });
    });
});
