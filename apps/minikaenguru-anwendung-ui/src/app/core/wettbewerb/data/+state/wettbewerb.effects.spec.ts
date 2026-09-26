import { Action } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { WettbewerbEffects } from './wettbewerb.effects';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { WettbewerbHttpService } from '../wettbewerb-http.service';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../../model/wettbewerb.model';
import { wettbewerbActions } from './wettbewerb.actions';

describe('WettbewerbEffects', () => {
    let action$: Subject<Action>;
    let effects: WettbewerbEffects;

    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    let httpServiceMock: { loadWettbewerb: ReturnType<typeof vi.fn> };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/api/wettbewerb',
    });

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        httpServiceMock = {
            loadWettbewerb: vi.fn(),
        };

        messagePublisherMock = {
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                WettbewerbEffects,
                provideMockActions(() => action$),
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
                {
                    provide: WettbewerbHttpService,
                    useValue: httpServiceMock,
                },
            ],
        });

        effects = TestBed.inject(WettbewerbEffects);
    });

    describe('loadWettbewerb$', () => {
        const wettbewerb: Wettbewerb = {
            beginn: '01.01.2029',
            ende: '31.07.2029',
            freischaltungPrivat: '15.06.2029',
            freischaltungSchulen: '14.03.2029',
            jahr: 2029,
            status: WETTBEWERBSSTATUS.anmeldung,
        };

        it('should call the httpService and map to wettbewerbLoaded', async () => {
            httpServiceMock.loadWettbewerb.mockReturnValueOnce(of(wettbewerb));

            const promise = firstValueFrom(effects.loadWettbewerb$);

            action$.next(wettbewerbActions.loadWettbewerb());

            const emitted = await promise;

            expect(emitted).toEqual(wettbewerbActions.wettbewerbLoaded({ wettbewerb }));
            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledOnce();
        });

        it('should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const httpFirst$ = new Subject<Wettbewerb>();
            const httpSecond$ = new Subject<Wettbewerb>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadWettbewerb
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.loadWettbewerb$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(wettbewerbActions.loadWettbewerb());

            expect(firstRequestFinalized).not.toHaveBeenCalled();
            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledTimes(1);

            action$.next(wettbewerbActions.loadWettbewerb());

            expect(firstRequestFinalized).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledTimes(2);

            httpFirst$.next(wettbewerb);
            httpFirst$.complete();

            httpSecond$.next(wettbewerb);
            httpSecond$.complete();

            expect(emittedActions).toEqual([wettbewerbActions.wettbewerbLoaded({ wettbewerb })]);

            subscription.unsubscribe();
        });

        it('should call the httpService and mat to loadWettbewerbFailed when httpErrorResponse', async () => {
            httpServiceMock.loadWettbewerb.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.loadWettbewerb$);

            action$.next(wettbewerbActions.loadWettbewerb());

            const emitted = await promise;

            expect(emitted).toEqual(wettbewerbActions.loadWettbewerbFailed({ error: httpServerErrorResponse }));
            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledOnce();
        });

        it('should call the httpService and mat to loadWettbewerbFailed when other Error', async () => {
            const error = new Error('uiuiui!');

            httpServiceMock.loadWettbewerb.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.loadWettbewerb$);

            action$.next(wettbewerbActions.loadWettbewerb());

            const emitted = await promise;

            expect(emitted).toEqual(wettbewerbActions.loadWettbewerbFailed({ error }));
            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledOnce();
        });

        it('should keep the effect stream alive after an error occured', () => {
            const httpFirst$ = new Subject<Wettbewerb>();
            const httpSecond$ = new Subject<Wettbewerb>();

            // Erster Request wirft error, zweiter Request erfolgreich
            httpServiceMock.loadWettbewerb.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.loadWettbewerb$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(wettbewerbActions.loadWettbewerb());

            httpFirst$.error(httpServerErrorResponse);

            expect(emittedActions).toEqual([
                wettbewerbActions.loadWettbewerbFailed({ error: httpServerErrorResponse }),
            ]);

            action$.next(wettbewerbActions.loadWettbewerb());

            expect(httpServiceMock.loadWettbewerb).toHaveBeenCalledTimes(2);

            httpSecond$.next(wettbewerb);
            httpSecond$.complete();

            expect(emittedActions).toEqual([
                wettbewerbActions.loadWettbewerbFailed({ error: httpServerErrorResponse }),
                wettbewerbActions.wettbewerbLoaded({ wettbewerb }),
            ]);

            subscription.unsubscribe();
        });
    });

    describe('loadWettbewerbFailed$', () => {
        it('should trigger an error message and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.loadWettbewerbFailed$);

            action$.next(wettbewerbActions.loadWettbewerbFailed({ error: httpServerErrorResponse }));
            await promise;

            expect(httpServiceMock.loadWettbewerb).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
        });
    });
});
