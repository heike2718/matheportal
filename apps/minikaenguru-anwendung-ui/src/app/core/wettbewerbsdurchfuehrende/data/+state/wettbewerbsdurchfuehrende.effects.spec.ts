import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { WettbewerbsdurchfuehrendeEffects } from './wettbewerbsdurchfuehrende.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { WettbewerbsdurchfuehrendeHttpService } from '../wettbewerbsdurchfuehrende-http.service';
import {
    DURCHFUEHRUNGSART,
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderRequest,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { WettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { Schule } from '../../../../core/model/schulkatalog.model';
import { schuleSelected } from '../../../../schulkatalog/schulkatalogsuche/api/schulkatalogsuche.events';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { fromWettbewerbsdurchfuehrender } from './wettbewerbsdurchfuehrende.selectors';

describe('WettbewerbsdurchfuehrendeEffects tests', () => {
    let action$: Subject<Action>;
    let effects: WettbewerbsdurchfuehrendeEffects;
    let store: MockStore;

    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    let httpServiceMock: {
        createWettbewerbsdurchfuehrenden: ReturnType<typeof vi.fn>;
        loadWettbewerbsdurchfuehrenden: ReturnType<typeof vi.fn>;
    };

    const requestDtoPrivat: WettbewerbsdurchfuehrenderRequest = {
        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
        schulkuerzel: undefined,
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    let routerMock: { navigate: ReturnType<typeof vi.fn> };

    let authSesisonFacadeMock: { validateSession: ReturnType<typeof vi.fn> };

    const conflictErrorResponse = new HttpErrorResponse({
        status: 409,
        error: { message: 'es ist ein Konflikt aufgetreten', constraintViolations: [] },
    });

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/authurls/login',
    });

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        httpServiceMock = {
            createWettbewerbsdurchfuehrenden: vi.fn(),
            loadWettbewerbsdurchfuehrenden: vi.fn(),
        };

        messagePublisherMock = {
            publishError: vi.fn(),
        };

        routerMock = {
            navigate: vi.fn(),
        };

        authSesisonFacadeMock = {
            validateSession: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                WettbewerbsdurchfuehrendeEffects,
                provideMockStore(),
                provideMockActions(() => action$),
                { provide: Router, useValue: routerMock },
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
                {
                    provide: WettbewerbsdurchfuehrendeHttpService,
                    useValue: httpServiceMock,
                },
                {
                    provide: AuthSessionFacade,
                    useValue: authSesisonFacadeMock,
                },
            ],
        });

        effects = TestBed.inject(WettbewerbsdurchfuehrendeEffects);
        store = TestBed.inject(Store) as MockStore;
    });

    describe('durchfuehrungsartPrivatGewaehlt$', () => {
        it('should map to durchfuehrendenAnlegen when durchfuehrungsartPrivatGewaehlt', async () => {
            const promise = firstValueFrom(effects.durchfuehrungsartPrivatGewaehlt$);

            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt());

            const emmited = await promise;

            expect(emmited).toEqual(
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat })
            );
        });
    });

    describe('durchfuehrungsartSchuleGewaehlt$', () => {
        it('should route to schulkatalogsuche when durchfuehrungsartSchuleGewaehlt', async () => {
            let effectTriggered = false;

            const subscription = effects.durchfuehrungsartSchuleGewaelt$.subscribe(() => {
                effectTriggered = true;
            });

            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt());

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'schulkatalogsuche']);

            expect(effectTriggered).toBe(true);

            subscription.unsubscribe();
        });
    });

    describe('schuleSelected$', () => {
        it('should dispatch durchfuehrendenAnlegen when schuleSelected', async () => {
            const schule: Schule = {
                ort: {
                    land: {
                        kuerzel: 'DE-TH',
                        name: 'Thüringen',
                        anzahlOrte: 345,
                    },
                    kuerzel: 'O-1',
                    name: 'Weimar',
                    anzahlSchulen: 15,
                },
                kuerzel: 'S-1',
                name: 'Johann-Wolfgang-Goethe-Schule',
            };

            const requestDto = { durchfuehrungsart: DURCHFUEHRUNGSART.schule, schulkuerzel: schule.kuerzel };

            const promise = firstValueFrom(effects.schuleSelected$);

            action$.next(schuleSelected({ schule }));

            const emitted = await promise;

            expect(emitted).toEqual(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto }));
        });
    });

    describe('durchfuehrendenAnlegen$', () => {
        it('should call the http service and map to durchfuehrendenAngelegt when ok', async () => {
            const responseDto: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: 'PRIVAT',
                newsletter: false,
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(of(responseDto));

            const promise = firstValueFrom(effects.durchfuehrendenAnlegen$);

            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));
            const emmited = await promise;

            expect(emmited).toEqual(
                WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ wettbewerbsdurchfuehrender: responseDto })
            );
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });

        it('should ignore the second action while the first request is active (exhaustMap)', async () => {
            const firstRequestDto: WettbewerbsdurchfuehrenderRequest = {
                durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                schulkuerzel: undefined,
            };

            const secondRequestDto: WettbewerbsdurchfuehrenderRequest = {
                durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                schulkuerzel: 'ABCDEFGH',
            };

            const responseDto1: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: 'PRIVAT',
                newsletter: false,
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const httpFirst$ = new Subject<Wettbewerbsdurchfuehrender>();

            const firstRequestFinalized = vi.fn();
            const secondRequestFinalized = vi.fn();

            // nur der erste request muss gemocked werden (exhaustMap)
            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValueOnce(httpFirst$);

            const emittedActions: unknown[] = [];
            const subscription = effects.durchfuehrendenAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- ACTION 1: Erste Action triggern ---
            action$.next(
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: firstRequestDto,
                })
            );

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenLastCalledWith(firstRequestDto);
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // --- ACTION 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: secondRequestDto,
                })
            );

            // Der Service darf trotz der zweiten Action NICHT noch einmal aufgerufen worden sein!
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(1);
            expect(firstRequestFinalized).not.toHaveBeenCalled();
            expect(secondRequestFinalized).not.toHaveBeenCalled();

            // --- Ersten Request erfolgreich beenden ---
            httpFirst$.next(responseDto1);
            httpFirst$.complete();

            expect(emittedActions).toEqual([
                WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({
                    wettbewerbsdurchfuehrender: responseDto1,
                }),
            ]);

            subscription.unsubscribe();
        });

        it('should call the http service and map to durchfuehrendenAnlegenFailed when httpMock throws ServerError', async () => {
            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.durchfuehrendenAnlegen$);

            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));

            const emmited = await promise;

            expect(emmited).toEqual(
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: httpServerErrorResponse })
            );
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });

        it('should call the http service and map to durchfuehrendenAnlegenFailed when httpMock throws other Error', async () => {
            const error = new Error('uiuiui!');
            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.durchfuehrendenAnlegen$);

            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));

            const emmited = await promise;

            expect(emmited).toEqual(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error }));
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });

        it('should keep the effect stream alive after an error occured', async () => {
            const firstRequestDto: WettbewerbsdurchfuehrenderRequest = {
                durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                schulkuerzel: undefined,
            };

            const secondRequestDto: WettbewerbsdurchfuehrenderRequest = {
                durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                schulkuerzel: 'ABCDEFGH',
            };

            const responseDto2: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: 'PRIVAT',
                newsletter: false,
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const httpFirst$ = new Subject<Wettbewerbsdurchfuehrender>();
            const httpSecond$ = new Subject<Wettbewerbsdurchfuehrender>();

            const firstRequestFinalized = vi.fn();
            const secondRequestFinalized = vi.fn();

            // nur der erste request muss gemocked werden (exhaustMap)
            httpServiceMock.createWettbewerbsdurchfuehrenden
                .mockReturnValueOnce(httpFirst$)
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.durchfuehrendenAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            // --- SCHRITT 1: Ersten Request triggern und Fehler simulieren ---
            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: firstRequestDto }));

            expect(firstRequestFinalized).not.toHaveBeenCalled();
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledWith(firstRequestDto);

            // Fehler werfen (simuliert ein fehlerhaftes Backend)
            httpFirst$.error(httpServerErrorResponse);

            // failed action muss getriggert worden sein
            expect(emittedActions).toEqual([
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: httpServerErrorResponse }),
            ]);

            // --- SCHRITT 2: Zweiten Request triggern ---
            // Wenn catchError an der FALSCHEN Stelle sitzt, ist der Stream jetzt tot.
            // Die Action wird dann komplett ignoriert und der HTTP-Service wird NICHT aufgerufen.
            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: secondRequestDto }));

            // der HTTP-Service muss trotz des errors aufgerufen worden sein
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(2);
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenLastCalledWith(secondRequestDto);
            expect(secondRequestFinalized).not.toHaveBeenCalled();

            // zweiten Request erfolgreich beenden
            httpSecond$.next(responseDto2);
            httpSecond$.complete();

            // die success action ist ebenfalls im array
            expect(emittedActions).toEqual([
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: httpServerErrorResponse }),
                WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ wettbewerbsdurchfuehrender: responseDto2 }),
            ]);

            // Aufräumen
            subscription.unsubscribe();
        });
    });

    describe('durchfuehrendenAnlegenFailed$ tests', () => {
        it('publishes an error message when durchfuehrendenAnlegenFailed with conflict', async () => {
            const promise = firstValueFrom(effects.durchfuehrendenAnlegenFailed$);

            action$.next(
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: conflictErrorResponse })
            );
            await promise;

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith('es ist ein Konflikt aufgetreten');
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });

        it('publishes an error message when durchfuehrendenAnlegenFailed with serverError', async () => {
            const promise = firstValueFrom(effects.durchfuehrendenAnlegenFailed$);

            action$.next(
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: httpServerErrorResponse })
            );
            await promise;

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });
    });

    describe('durchfuehrendenAngelegt$ tests', () => {
        it('should route to dashboard-privatperson when durchfuerender mit Durchführungsart privat angelegt', async () => {
            const responseDto: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: 'PRIVAT',
                newsletter: false,
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const promise = firstValueFrom(effects.durchfuehrenderAngelegt$);

            action$.next(
                WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ wettbewerbsdurchfuehrender: responseDto })
            );

            await promise;

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'privatperson']);
            expect(authSesisonFacadeMock.validateSession).toHaveBeenCalledOnce();
        });

        it('should route to lehrperson when durchfuerender mit Durchführungsart schule angelegt', async () => {
            const responseDto: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: 'SCHULE',
                newsletter: false,
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const promise = firstValueFrom(effects.durchfuehrenderAngelegt$);

            action$.next(
                WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ wettbewerbsdurchfuehrender: responseDto })
            );

            await promise;

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'lehrperson']);
            expect(authSesisonFacadeMock.validateSession).toHaveBeenCalledOnce();
        });
    });

    describe('ensureWettbewerbGeladen$', () => {
        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to durchfuehrendenLaden when loadState %s',
            async loadState => {
                store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrenderLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensureDurchfuehrenderGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(WettbewerbsdurchfuehrendeActions.ensureDurchfuehrenderGeladen());

                    expect(emittedActions).toEqual([WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden()]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it.each(['loaded', 'unauthorized'] as const)(
            'should not map to wettbewerbLaden when state is %s',
            async loadState => {
                store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrenderLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensureDurchfuehrenderGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(WettbewerbsdurchfuehrendeActions.ensureDurchfuehrenderGeladen());

                    expect(emittedActions).toEqual([]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );
    });

    describe('durchfuehrendenLaden$', () => {
        const wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender = {
            durchfuehrungsart: DURCHFUEHRUNGSART.privat,
            newsletter: true,
            zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.entzogen,
        };

        it('should not call the httpService and not emit an action when already loaded', async () => {
            store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrenderGeladen, true);
            store.refreshState();

            const emittedActions: Action[] = [];
            const subscription = effects.durchfuehrendenLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden());
                expect(emittedActions).toEqual([]);
                expect(httpServiceMock.loadWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the http-service and emit durchfuehrenderLoaded when not loaded', async () => {
            store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrenderGeladen, false);
            store.refreshState();

            httpServiceMock.loadWettbewerbsdurchfuehrenden.mockReturnValueOnce(of(wettbewerbsdurchfuehrender));

            const promise = firstValueFrom(effects.durchfuehrendenLaden$);

            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden());

            const emitted = await promise;

            expect(emitted).toEqual(
                WettbewerbsdurchfuehrendeActions.durchfuehrenderGeladen({ wettbewerbsdurchfuehrender })
            );
            expect(httpServiceMock.loadWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
        });

        it('should not cancel previous pending requests (exhaustMap)', async () => {
            store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrenderGeladen, false);
            store.refreshState();

            const httpFirst$ = new Subject<Wettbewerbsdurchfuehrender>();
            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadWettbewerbsdurchfuehrenden.mockReturnValueOnce(httpFirst$);

            const emittedActions: Action[] = [];
            const subscription = effects.durchfuehrendenLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                // --- ACTION 1: Erste Action triggern ---
                action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden());

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(1);

                // --- ACTION 2: Zweite Action triggern (während Request 1 noch läuft) ---
                action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden());

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(1);

                httpFirst$.next(wettbewerbsdurchfuehrender);
                httpFirst$.complete();

                expect(emittedActions).toEqual([
                    WettbewerbsdurchfuehrendeActions.durchfuehrenderGeladen({ wettbewerbsdurchfuehrender }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to loadWettbewerbFailed when httpErrorResponse', async () => {
            store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrenderGeladen, false);
            store.refreshState();

            httpServiceMock.loadWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.durchfuehrendenLaden$);

            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden());

            const emitted = await promise;

            expect(emitted).toEqual(
                WettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed({ error: httpServerErrorResponse })
            );
            expect(httpServiceMock.loadWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
        });

        it('should call the httpService and map to loadWettbewerbFailed when other Error', async () => {
            store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrenderGeladen, false);
            store.refreshState();

            const error = new Error('uiuiui!');

            httpServiceMock.loadWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.durchfuehrendenLaden$);

            action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden());

            const emitted = await promise;

            expect(emitted).toEqual(WettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed({ error }));
            expect(httpServiceMock.loadWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
        });

        it('should keep the effect stream alive after an error occured', async => {
            store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrenderGeladen, false);
            store.refreshState();

            const httpFirst$ = new Subject<Wettbewerbsdurchfuehrender>();
            const httpSecond$ = new Subject<Wettbewerbsdurchfuehrender>();

            // Erster Request wirft error, zweiter Request erfolgreich
            httpServiceMock.loadWettbewerbsdurchfuehrenden
                .mockReturnValueOnce(httpFirst$)
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.durchfuehrendenLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    WettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed({ error: httpServerErrorResponse }),
                ]);

                expect(httpServiceMock.loadWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(1);

                action$.next(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden());

                httpSecond$.next(wettbewerbsdurchfuehrender);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    WettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed({ error: httpServerErrorResponse }),
                    WettbewerbsdurchfuehrendeActions.durchfuehrenderGeladen({ wettbewerbsdurchfuehrender }),
                ]);
                expect(httpServiceMock.loadWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(2);
            } finally {
                subscription.unsubscribe();
            }
        });
    });
});
