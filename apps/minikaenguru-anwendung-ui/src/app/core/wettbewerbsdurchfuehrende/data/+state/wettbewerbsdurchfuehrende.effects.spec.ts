import { finalize, firstValueFrom, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { WettbewerbsdurchfuehrendeEffects } from './wettbewerbsdurchfuehrende.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { WettbewerbsdurchfuehrendeHttpService } from '../wettbewerbsdurchfuehrende-http.service';
import {
    DURCHFUEHRUNGSART,
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderRequest,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { AuthSessionFacade } from '@matheportal/auth-api';

describe('WettbewerbsdurchfuehrendeEffects tests', () => {
    let action$: ReplaySubject<unknown>;
    let effects: WettbewerbsdurchfuehrendeEffects;

    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    let httpServiceMock: { createWettbewerbsdurchfuehrenden: ReturnType<typeof vi.fn> };

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
        action$ = new ReplaySubject<unknown>(1);

        httpServiceMock = {
            createWettbewerbsdurchfuehrenden: vi.fn(),
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
    });

    describe('durchfuehrungsartPrivatGewaehlt$', () => {
        it('should map to durchfuehrendenAnlegen when durchfuehrungsartPrivatGewaehlt', async () => {
            const emittedPromise = firstValueFrom(effects.durchfuehrungsartPrivatGewaehlt$);

            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt());

            const emmited = await emittedPromise;

            expect(emmited).toEqual(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat })
            );
        });
    });

    describe('durchfuehrungsartSchuleGewaehlt$', () => {
        it('should route to schulkatalogsuche when durchfuehrungsartSchuleGewaehlt', async () => {
            let effectTriggered = false;

            const subscription = effects.durchfuehrungsartSchuleGewaelt$.subscribe(() => {
                effectTriggered = true;
            });

            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt());

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'schulkatalogsuche']);

            expect(effectTriggered).toBe(true);

            subscription.unsubscribe();
        });
    });

    describe('durchfuehrendenAnlegen$', () => {
        it('should call the http service and map to durchfuehrendenAngelegt when ok', async () => {
            const responseDto: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: 'PRIVAT',
                newsletter: false,
                teilnahmenummern: ['A123456789'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(of(responseDto));

            const emittedPromise = firstValueFrom(effects.durchfuehrendenAnlegen$);

            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));
            const emmited = await emittedPromise;

            expect(emmited).toEqual(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto }));
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
                teilnahmenummern: ['A123456789'],
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
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: firstRequestDto,
                })
            );

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenLastCalledWith(firstRequestDto);
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // --- ACTION 2: Zweite Action triggern (während Request 1 noch läuft) ---
            action$.next(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
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
                wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({
                    responseDto: responseDto1,
                }),
            ]);

            subscription.unsubscribe();
        });

        it('should keep the effect stream alive after an error occured', async () => {
            expect(true).toBe(false);
        });

        it('should call the http service and map to durchfuehrendenAnlegenFailed when httpMock throws ServerError', async () => {
            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => httpServerErrorResponse));

            const emittedPromise = firstValueFrom(effects.durchfuehrendenAnlegen$);

            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));

            const emmited = await emittedPromise;

            expect(emmited).toEqual(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: httpServerErrorResponse })
            );
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });

        it('should call the http service and map to durchfuehrendenAnlegenFailed when httpMock throws other Error', async () => {
            const error = new Error('uiuiui!');
            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => error));

            const emittedPromise = firstValueFrom(effects.durchfuehrendenAnlegen$);

            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));

            const emmited = await emittedPromise;

            expect(emmited).toEqual(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error }));
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });
    });

    describe('durchfuehrendenAnlegenFailed$ tests', () => {
        it('publishes an error message when durchfuehrendenAnlegenFailed with conflict', async () => {
            action$.next(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: conflictErrorResponse })
            );
            await firstValueFrom(effects.durchfuehrendenAnlegenFailed$);

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith('es ist ein Konflikt aufgetreten');
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });
        it('publishes an error message when durchfuehrendenAnlegenFailed with serverError', async () => {
            action$.next(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: httpServerErrorResponse })
            );
            await firstValueFrom(effects.durchfuehrendenAnlegenFailed$);

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
                teilnahmenummern: ['A123456789'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            let effectTriggered = false;

            const subscription = effects.durchfuehrenderAngelegt$.subscribe(() => {
                effectTriggered = true;
            });

            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto }));

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'dashboard-privatperson']);
            expect(authSesisonFacadeMock.validateSession).toHaveBeenCalledOnce();
            expect(effectTriggered).toBe(true);

            subscription.unsubscribe();
        });

        it('should route to dashboard-lehrperson when durchfuerender mit Durchführungsart schule angelegt', async () => {
            const responseDto: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: 'SCHULE',
                newsletter: false,
                teilnahmenummern: ['A1234567'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            let effectTriggered = false;

            const subscription = effects.durchfuehrenderAngelegt$.subscribe(() => {
                effectTriggered = true;
            });

            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto }));

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'dashboard-lehrperson']);
            expect(authSesisonFacadeMock.validateSession).toHaveBeenCalledOnce();
            expect(effectTriggered).toBe(true);

            subscription.unsubscribe();
        });
    });
});
