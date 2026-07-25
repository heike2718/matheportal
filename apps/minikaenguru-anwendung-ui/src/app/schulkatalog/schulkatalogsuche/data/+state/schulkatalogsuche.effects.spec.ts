import { finalize, firstValueFrom, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { SchulkatalogsucheEffects } from './schulkatalogsuche.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { SchulkatalogsucheHttpService } from '../schulkatalogsuche-http.service';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { schulkatalogsucheActions } from './schulkatalogsuche.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';

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
        it('findOrte$ should call the httpService and map to findOrteSucceeded when successfull', async () => {
            const orte: Ort[] = [
                {
                    kuerzel: 'ORT-1',
                    name: 'erster Ort',
                    land: {
                        kuerzel: 'DE-BY',
                        name: 'Bayern',
                    },
                    anzahlSchulen: 10,
                },
                {
                    kuerzel: 'ORT-2',
                    name: 'zweiter Ort',
                    land: {
                        kuerzel: 'DE-HE',
                        name: 'Hessen',
                    },
                    anzahlSchulen: 5,
                },
            ];
            const name = 'ortname';

            httpServiceMock.findOrte.mockReturnValue(of(orte));
            action$.next(schulkatalogsucheActions.findOrte({ name }));

            const emmited = await firstValueFrom(effects.findOrte$);
            expect(emmited).toEqual(schulkatalogsucheActions.findOrteSucceeded({ orte }));
            expect(httpServiceMock.findOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.findOrte).toHaveBeenCalledWith(name);
        });
        it('findOrte$ should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const treffer1: Ort[] = [
                {
                    kuerzel: 'ORT-1',
                    name: 'erster Ort',
                    land: {
                        kuerzel: 'DE-BY',
                        name: 'Bayern',
                    },
                    anzahlSchulen: 10,
                },
                {
                    kuerzel: 'ORT-2',
                    name: 'zweiter Ort',
                    land: {
                        kuerzel: 'DE-HE',
                        name: 'Hessen',
                    },
                    anzahlSchulen: 5,
                },
            ];

            const treffer2: Ort[] = [
                {
                    kuerzel: 'ORT-3',
                    name: 'dritter Ort',
                    land: {
                        kuerzel: 'DE-HH',
                        name: 'Hamburg',
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

            // effect abonnieren
            const emittedPromise = firstValueFrom(effects.findOrte$);

            // effect bekommt die erste action mit Rückgabe httpFirst$
            action$.next(schulkatalogsucheActions.findOrte({ name: 'ErsterOrt' }));

            // switchMap abonniert httpFirst$ request läuft
            expect(httpServiceMock.findOrte).toHaveBeenCalledTimes(1);
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // effect bekommt die zweite action, während der erste request noch läuf
            action$.next(schulkatalogsucheActions.findOrte({ name: 'ZweiterOrt' }));

            // switchMap hat den ersten Request sofort abbestellt.
            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.findOrte).toHaveBeenCalledTimes(2);

            // Verspätete Antwort des ersten Requests simulieren.
            // Sie darf den Effect nicht mehr erreichen.
            httpFirst$.next(treffer1);
            httpFirst$.complete();

            // Antwort des zweiten Requests simulieren.
            httpSecond$.next(treffer2);
            httpSecond$.complete();

            await expect(emittedPromise).resolves.toEqual(
                schulkatalogsucheActions.findOrteSucceeded({
                    orte: treffer2,
                })
            );
        });
        it('findOrte$ should call the httpService and map to findOrteFailed when httpErrorResponse', async () => {
            const name = 'ortname';

            httpServiceMock.findOrte.mockReturnValue(throwError(() => httpServerErrorResponse));
            action$.next(schulkatalogsucheActions.findOrte({ name }));

            const emmited = await firstValueFrom(effects.findOrte$);
            expect(emmited).toEqual(schulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.findOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.findOrte).toHaveBeenCalledWith(name);
        });
        it('findOrte$ should call the httpService and map to findOrteFailed when other Error', async () => {
            const name = 'ortname';
            const error = new Error('uiuiui!');

            httpServiceMock.findOrte.mockReturnValue(throwError(() => error));
            action$.next(schulkatalogsucheActions.findOrte({ name }));

            const emmited = await firstValueFrom(effects.findOrte$);
            expect(emmited).toEqual(schulkatalogsucheActions.findOrteFailed({ error }));
            expect(httpServiceMock.findOrte).toHaveBeenCalledOnce();
            expect(httpServiceMock.findOrte).toHaveBeenCalledWith(name);
        });
    });

    describe('ortSelected$', () => {
        it('ortSelected should map to loadSchulen', async () => {
            const ort: Ort = {
                kuerzel: 'ORT-2',
                name: 'zweiter Ort',
                land: {
                    kuerzel: 'DE-HE',
                    name: 'Hessen',
                },
                anzahlSchulen: 5,
            };

            action$.next(schulkatalogsucheActions.ortSelected({ ort }));

            const emmited = await firstValueFrom(effects.ortSelected$);
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
            },
            anzahlSchulen: 2,
        };

        const ort2: Ort = {
            kuerzel: 'ORT-2',
            name: 'zweiter Ort',
            land: {
                kuerzel: 'DE-SH',
                name: 'Schleswig-Holstein',
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

        it('loadSchulen$ should call the httpService and map to loadSchulenSucceeded when successfull', async () => {
            httpServiceMock.loadSchulen.mockReturnValue(of(schulenOrt1));
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort1 }));

            const emmited = await firstValueFrom(effects.loadSchulen$);
            expect(emmited).toEqual(
                schulkatalogsucheActions.loadSchulenSucceeded({ ortId: ort1.kuerzel, schulen: schulenOrt1 })
            );
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith(ort1.kuerzel);
        });
        it('loadSchulen$ should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const httpFirst$ = new Subject<Schule[]>();
            const httpSecond$ = new Subject<Schule[]>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadSchulen
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedPromise = firstValueFrom(effects.loadSchulen$);

            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort1 }));

            expect(httpServiceMock.loadSchulen).toHaveBeenCalledTimes(1);
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort2 }));

            // Verspätete Antwort des ersten Requests simulieren.
            // Sie darf den Effect nicht mehr erreichen.
            httpFirst$.next(schulenOrt1);
            httpFirst$.complete();

            // Antwort des zweiten Requests simulieren.
            httpSecond$.next(schulenOrt2);
            httpSecond$.complete();

            await expect(emittedPromise).resolves.toEqual(
                schulkatalogsucheActions.loadSchulenSucceeded({
                    ortId: ort2.kuerzel,
                    schulen: schulenOrt2,
                })
            );
        });
        it('loadSchulen$ should call the httpService and map to loadSchulenFailed when httpErrorResponse', async () => {
            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => httpServerErrorResponse));
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort1 }));

            const emmited = await firstValueFrom(effects.loadSchulen$);
            expect(emmited).toEqual(schulkatalogsucheActions.loadSchulenFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith(ort1.kuerzel);
        });
        it('loadSchulen$ should call the httpService and map to loadSchulenFailed when other Error', async () => {
            const error = new Error('uiuiui!');
            httpServiceMock.loadSchulen.mockReturnValue(throwError(() => error));
            action$.next(schulkatalogsucheActions.loadSchulen({ ort: ort1 }));

            const emmited = await firstValueFrom(effects.loadSchulen$);
            expect(emmited).toEqual(schulkatalogsucheActions.loadSchulenFailed({ error }));
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadSchulen).toHaveBeenCalledWith(ort1.kuerzel);
        });
    });
    describe('findOrteFailed$', () => {
        it('findOrteFailed$ should trigger an error message', async () => {
            action$.next(schulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse }));
            await firstValueFrom(effects.findOrteFailed$);

            expect(httpServiceMock.findOrte).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
        });
    });
});
