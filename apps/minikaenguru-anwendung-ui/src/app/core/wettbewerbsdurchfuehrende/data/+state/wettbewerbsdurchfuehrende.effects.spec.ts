import { firstValueFrom, of, ReplaySubject, throwError } from 'rxjs';
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
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

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

    let routerMock: { navigateByUrl: ReturnType<typeof vi.fn> };

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
            navigateByUrl: vi.fn(),
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
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
        });

        it('should call the http service and map to durchfuehrendenAnlegenFailed when httpMock throws ServerError', async () => {
            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => httpServerErrorResponse));
            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));
            const emmited = await firstValueFrom(effects.durchfuehrendenAnlegen$);
            expect(emmited).toEqual(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: httpServerErrorResponse })
            );
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
        });
        it('should call the http service and map to durchfuehrendenAnlegenFailed when httpMock throws other Error', async () => {
            const error = new Error('uiuiui!');
            httpServiceMock.createWettbewerbsdurchfuehrenden.mockReturnValue(throwError(() => error));
            action$.next(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto: requestDtoPrivat }));
            const emmited = await firstValueFrom(effects.durchfuehrendenAnlegen$);
            expect(emmited).toEqual(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error }));
            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).toHaveBeenCalledOnce();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
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
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
        });
        it('publishes an error message when durchfuehrendenAnlegenFailed with serverError', async () => {
            action$.next(
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error: httpServerErrorResponse })
            );
            await firstValueFrom(effects.durchfuehrendenAnlegenFailed$);

            expect(httpServiceMock.createWettbewerbsdurchfuehrenden).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
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
            expect(routerMock.navigateByUrl).toHaveBeenCalledOnce();
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/minikaenguru-anwendung/dashboard-privatperson');
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
            expect(routerMock.navigateByUrl).toHaveBeenCalledOnce();
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/minikaenguru-anwendung/dashboard-lehrperson');
        });
    });
});
