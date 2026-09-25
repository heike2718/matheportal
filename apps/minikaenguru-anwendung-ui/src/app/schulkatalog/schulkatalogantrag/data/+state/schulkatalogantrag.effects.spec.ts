import { Action } from '@ngrx/store';
import { SchulkatalogantragEffects } from './schulkatalogantrag.effects';
import { firstValueFrom, Subject, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { SchulkatalogantragHttpService } from '../schulkatalogantrag-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Schulkatalogantrag } from '../../model/schulkatalogantrag.model';
import { schulkatalogantragActions } from './schulkatalogantrag.actions';
import { HttpErrorResponse } from '@angular/common/http';

describe('SchulkatalogantragEffects', () => {
    const expectedSuccessMessage =
        'Vielen Dank! Wir haben Ihre Anfrage erhalten und werden die Schule zeitnah in unseren Schulkatalog aufnehmen. Sobald die Schule eingetragen ist, erhalten Sie eine E-Mail.';

    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/eine/resource',
    });

    let action$: Subject<Action>;
    let effects: SchulkatalogantragEffects;

    let httpServiceMock: {
        submitSchulkatalogantrag: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishInfo: ReturnType<typeof vi.fn>; publishError: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        httpServiceMock = {
            submitSchulkatalogantrag: vi.fn(),
        };

        messagePublisherMock = {
            publishInfo: vi.fn(),
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                SchulkatalogantragEffects,
                provideMockActions(() => action$),
                {
                    provide: SchulkatalogantragHttpService,
                    useValue: httpServiceMock,
                },
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
            ],
        });

        effects = TestBed.inject(SchulkatalogantragEffects);
    });

    describe('submitSchulkatalogantrag$', () => {
        const antrag: Schulkatalogantrag = {
            emailAuftraggeber: 'test@provider.de',
            nameLand: 'Schweiz',
            nameOrt: 'Winterthur',
            nameSchule: 'Primarschule Kirchgässli',
            plz: '7645',
            strasseUndHausnummer: 'Kirchgässli 12',
        };

        it('should ignore the second action while the first request is active (exhaustMap)', () => {
            const httpFirst$ = new Subject<void>();

            httpServiceMock.submitSchulkatalogantrag.mockReturnValue(httpFirst$);

            const emittedActions: Action[] = [];
            const subscription = effects.submitSchulkatalogantrag$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(schulkatalogantragActions.submitSchulkatalogantrag({ antrag }));

            expect(httpServiceMock.submitSchulkatalogantrag).toHaveBeenCalledOnce();
            expect(httpServiceMock.submitSchulkatalogantrag).toHaveBeenCalledWith(antrag);

            action$.next(schulkatalogantragActions.submitSchulkatalogantrag({ antrag }));

            expect(httpServiceMock.submitSchulkatalogantrag).toHaveBeenCalledOnce();

            httpFirst$.next();
            httpFirst$.complete();

            expect(emittedActions).toEqual([schulkatalogantragActions.submitSchulkatalogantragSucceeded()]);

            subscription.unsubscribe();
        });

        it('should call the httpService and map to actionFailed when httpErrorResponse', async () => {
            httpServiceMock.submitSchulkatalogantrag.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.submitSchulkatalogantrag$);

            action$.next(schulkatalogantragActions.submitSchulkatalogantrag({ antrag }));
            const emmited = await promise;

            expect(emmited).toEqual(
                schulkatalogantragActions.submitSchulkatalogantragFailed({ error: httpServerErrorResponse })
            );

            expect(httpServiceMock.submitSchulkatalogantrag).toHaveBeenCalledOnce();
            expect(httpServiceMock.submitSchulkatalogantrag).toHaveBeenCalledWith(antrag);
        });

        it('should keep the effect stream alive after an error occurred', async () => {
            const httpFirst$ = new Subject<void>();
            const httpSecond$ = new Subject<void>();

            httpServiceMock.submitSchulkatalogantrag.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.submitSchulkatalogantrag$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(schulkatalogantragActions.submitSchulkatalogantrag({ antrag }));

            expect(httpServiceMock.submitSchulkatalogantrag).toHaveBeenCalledOnce();
            expect(httpServiceMock.submitSchulkatalogantrag).toHaveBeenCalledWith(antrag);

            httpFirst$.error(httpServerErrorResponse);

            expect(emittedActions).toEqual([
                schulkatalogantragActions.submitSchulkatalogantragFailed({ error: httpServerErrorResponse }),
            ]);

            action$.next(schulkatalogantragActions.submitSchulkatalogantrag({ antrag }));

            expect(httpServiceMock.submitSchulkatalogantrag).toHaveBeenCalledTimes(2);

            httpSecond$.next();
            httpSecond$.complete();

            expect(emittedActions).toEqual([
                schulkatalogantragActions.submitSchulkatalogantragFailed({ error: httpServerErrorResponse }),
                schulkatalogantragActions.submitSchulkatalogantragSucceeded(),
            ]);

            subscription.unsubscribe();
        });
    });

    describe('submitSchulkatalogantragSucceeded$', () => {
        it('should show the expected message', async () => {
            const promise = firstValueFrom(effects.submitSchulkatalogantragSucceeded$);

            action$.next(schulkatalogantragActions.submitSchulkatalogantragSucceeded());

            await promise;

            expect(messagePublisherMock.publishInfo).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishInfo).toHaveBeenCalledWith(expectedSuccessMessage);
        });
    });

    describe('submitSchulkatalogantragFailed$', () => {
        it('should show the expected message', async () => {
            const promise = firstValueFrom(effects.submitSchulkatalogantragFailed$);

            action$.next(schulkatalogantragActions.submitSchulkatalogantragFailed({ error: httpServerErrorResponse }));

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
        });
    });
});
