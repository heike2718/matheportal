import { finalize, firstValueFrom, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { WettbewerbsdurchfuehrendeEffects } from './wettbewerbsdurchfuehrende.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { WettbewerbsdurchfuehrendeHttpService } from '../wettbewerbsdurchfuehrende-http.service';
import {
    DURCHFUEHRUNGSART,
    WettbewerbsdurchfuehrenderDto,
    WettbewerbsdurchfuerenderRequest,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';

describe('WettbewerbsdurchfuehrendeEffects tests', () => {
    let action$: ReplaySubject<unknown>;
    let effects: WettbewerbsdurchfuehrendeEffects;

    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    let httpServiceMock: { createWettbewerbsdurchfuehrenden: ReturnType<typeof vi.fn> };

    const requestDtoPrivat: WettbewerbsdurchfuerenderRequest = {
        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
        schule: null,
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    let routerMock: { navigate: ReturnType<typeof vi.fn> };

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
            ],
        });

        effects = TestBed.inject(WettbewerbsdurchfuehrendeEffects);
    });

    describe('durchfuehrungsartPrivatGewaehlt$', () => {
        it('should map to durchfuehrendenAnlegen when durchfuehrungsartPrivatGewaehlt', async () => {
            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt());
            const emmited = await firstValueFrom(effects.durchfuehrungsartPrivatGewaehlt$);

            expect(emmited).toEqual(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat })
            );
        });
    });

    describe('durchfuehrungsartSchuleGewaehlt$', () => {
        it('should route to schulkatalogsuche when durchfuehrungsartSchuleGewaehlt', async () => {
            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt());
            await firstValueFrom(effects.durchfuehrungsartSchuleGewaelt$);

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'schulkatalogsuche']);
        });
    });

    describe('durchfuehrendenAnlegen$', () => {
        it('should call the http service and map to durchfuehrendenAngelegt when ok', async () => {
            const responseDto: WettbewerbsdurchfuehrenderDto = {
                durchfuehrungsart: 'PRIVAT',
                newsletter: false,
                teilnahmenummern: ['A123456789'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(of(responseDto));
            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));
            const emmited = await firstValueFrom(effects.durchfuehrendenAnlegen$);
            expect(emmited).toEqual(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto }));
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });

        it('should finish the first action not start the second request (exhaustMap)', async () => {
            const firstRequestDto: WettbewerbsdurchfuerenderRequest = {
                durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                schule: null,
            };

            const secondRequestDto: WettbewerbsdurchfuerenderRequest = {
                durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                schule: 'ABCDEFGH',
            };

            const responseDto1: WettbewerbsdurchfuehrenderDto = {
                durchfuehrungsart: 'PRIVAT',
                newsletter: false,
                teilnahmenummern: ['A123456789'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const httpFirst$ = new Subject<WettbewerbsdurchfuehrenderDto>();
            const httpSecond$ = new Subject<WettbewerbsdurchfuehrenderDto>();

            const firstRequestFinalized = vi.fn();
            const secondRequestFinalized = vi.fn();

            httpServiceMock.createWettbewerbsdurchfuehrenden
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$.pipe(finalize(secondRequestFinalized)));

            // effect abonnieren
            const emittedPromise = firstValueFrom(effects.durchfuehrendenAnlegen$);

            // effect bekommt die erste action mit Rückgabe httpFirst$
            action$.next(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: firstRequestDto,
                })
            );
            // exhaustMap abonniert httpFirst$. request läuft
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(1);
            expect(firstRequestFinalized).not.toHaveBeenCalled();

            // effect bekommt die zweite action, während httpFirst$ noch nicht emmited hat
            action$.next(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: secondRequestDto,
                })
            );

            // Zweite Action wurde ignoriert.
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(1);
            expect(firstRequestFinalized).not.toHaveBeenCalled();
            expect(secondRequestFinalized).not.toHaveBeenCalled();

            // Eintreffen des responses simulieren
            httpFirst$.next(responseDto1);
            httpFirst$.complete();

            await expect(emittedPromise).resolves.toEqual(
                wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({
                    responseDto: responseDto1,
                })
            );

            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(secondRequestFinalized).not.toHaveBeenCalled();
        });

        it('should accept a new action after the pending request completed', async () => {
            const firstRequestDto: WettbewerbsdurchfuerenderRequest = {
                durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                schule: null,
            };

            const secondRequestDto: WettbewerbsdurchfuerenderRequest = {
                durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                schule: 'ABCDEFGH',
            };

            const responseDto1: WettbewerbsdurchfuehrenderDto = {
                durchfuehrungsart: 'PRIVAT',
                newsletter: false,
                teilnahmenummern: ['A123456789'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const responseDto2: WettbewerbsdurchfuehrenderDto = {
                durchfuehrungsart: 'SCHULE',
                newsletter: false,
                teilnahmenummern: ['ABCDEFGH'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const httpFirst$ = new Subject<WettbewerbsdurchfuehrenderDto>();
            const httpSecond$ = new Subject<WettbewerbsdurchfuehrenderDto>();

            httpServiceMock.createWettbewerbsdurchfuehrenden
                .mockReturnValueOnce(httpFirst$)
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.durchfuehrendenAnlegen$.subscribe(action => emittedActions.push(action));

            action$.next(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: firstRequestDto,
                })
            );

            httpFirst$.next(responseDto1);
            httpFirst$.complete();

            action$.next(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: secondRequestDto,
                })
            );

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledTimes(2);

            httpSecond$.next(responseDto2);
            httpSecond$.complete();

            expect(emittedActions).toEqual([
                wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({
                    responseDto: responseDto1,
                }),
                wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({
                    responseDto: responseDto2,
                }),
            ]);

            subscription.unsubscribe();
        });

        it('should call the http service and map to durchfuehrendenAnlegenFailed when httpMock throws ServerError', async () => {
            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => httpServerErrorResponse));
            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));
            const emmited = await firstValueFrom(effects.durchfuehrendenAnlegen$);
            expect(emmited).toEqual(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: httpServerErrorResponse })
            );
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(routerMock.navigate).not.toHaveBeenCalled();
        });
        it('should call the http service and map to durchfuehrendenAnlegenFailed when httpMock throws other Error', async () => {
            const error = new Error('uiuiui!');
            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => error));
            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));
            const emmited = await firstValueFrom(effects.durchfuehrendenAnlegen$);
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
            const responseDto: WettbewerbsdurchfuehrenderDto = {
                durchfuehrungsart: 'PRIVAT',
                newsletter: false,
                teilnahmenummern: ['A123456789'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto }));
            await firstValueFrom(effects.durchfuehrenderAngelegt$);

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'dashboard-privatperson']);
        });

        it('should route to dashboard-lehrperson when durchfuerender mit Durchführungsart schule angelegt', async () => {
            const responseDto: WettbewerbsdurchfuehrenderDto = {
                durchfuehrungsart: 'SCHULE',
                newsletter: false,
                teilnahmenummern: ['A1234567'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto }));
            await firstValueFrom(effects.durchfuehrenderAngelegt$);

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'minikaenguru-anwendung', 'dashboard-lehrperson']);
        });
    });
});
