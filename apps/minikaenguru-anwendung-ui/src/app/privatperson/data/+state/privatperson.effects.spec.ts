import { Action, Store } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { PrivatpersonEffects } from './privatperson.effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DefaultUrlSerializer, Navigation, Router } from '@angular/router';
import { PrivatpersonActions } from './privatperson.actions';
import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import {
    selectWettbewerbskontextLadenVerweigert,
    selectWettbewerbskontextLoaded,
    selectWettbewerbskontextLoadState,
} from './privatperson.selectors';
import { HttpErrorResponse } from '@angular/common/http';
import { ArbeitskontextHttpService } from '../../../core/services/arbeitskontext-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { getEffectsMetadata } from '@ngrx/effects';

describe('PrivatpersonEffects', () => {
    const urlSerializer = new DefaultUrlSerializer();
    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/authurls/login',
    });

    const routerMock = {
        navigate: vi.fn(),
        currentNavigation: vi.fn<() => Pick<Navigation, 'extractedUrl' | 'finalUrl'> | null>(),
        parseUrl: vi.fn((url: string) => urlSerializer.parse(url)),
        url: '/minikaenguru-anwendung',
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    let action$: Subject<Action>;
    let effects: PrivatpersonEffects;
    let store: MockStore;

    const httpServiceMock = {
        loadPrivatpersonWettbewerbskontext: vi.fn(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        routerMock.currentNavigation.mockReturnValue(null);
        routerMock.parseUrl.mockImplementation(url => urlSerializer.parse(url));
        routerMock.url = '/minikaenguru-anwendung';

        messagePublisherMock = {
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                provideMockStore(),
                PrivatpersonEffects,
                provideMockActions(() => action$),
                { provide: Router, useValue: routerMock },
                { provide: ArbeitskontextHttpService, useValue: httpServiceMock },
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
            ],
        });

        effects = TestBed.inject(PrivatpersonEffects);
        store = TestBed.inject(Store) as MockStore;
    });

    describe('ensureWettbewerbskontextPrivatGeladen$', () => {
        it('should map to wettbewerbskontextLaden', async () => {
            const promise = firstValueFrom(effects.ensureWettbewerbskontextPrivatGeladen$);

            action$.next(PrivatpersonActions.ensureWettbewerbskontextGeladen());

            const emitted = await promise;

            expect(httpServiceMock.loadPrivatpersonWettbewerbskontext).not.toHaveBeenCalled();
            expect(emitted).toEqual(PrivatpersonActions.wettbewerbskontextLaden());
        });
    });

    describe('wettbewerbskontextLaden$', () => {
        const wettbewerbskontext: PrivatpersonWettbewerbskontext = {
            anmeldungMoeglich: false,
            teilnahmerefs: [],
        };

        it('should not trigger the backend call when wettbewerbskontextLadenVerweigert', async () => {
            store.overrideSelector(selectWettbewerbskontextLadenVerweigert, true);
            store.refreshState();

            const emittedActions: Action[] = [];
            const subscription = effects.wettbewerbskontextLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(PrivatpersonActions.wettbewerbskontextLaden());

                expect(emittedActions).toEqual([]);
                expect(httpServiceMock.loadPrivatpersonWettbewerbskontext).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to wettbewerbskontextGeladen when successful', async () => {
            store.overrideSelector(selectWettbewerbskontextLadenVerweigert, false);
            store.refreshState();

            httpServiceMock.loadPrivatpersonWettbewerbskontext.mockReturnValue(of(wettbewerbskontext));

            const promise = firstValueFrom(effects.wettbewerbskontextLaden$);

            action$.next(PrivatpersonActions.wettbewerbskontextLaden());
            const emitted = await promise;

            expect(emitted).toEqual(PrivatpersonActions.wettbewerbskontextGeladen({ wettbewerbskontext }));
            expect(httpServiceMock.loadPrivatpersonWettbewerbskontext).toHaveBeenCalledOnce();
        });

        it('should switch to the latest action and cancel previous pending requests (switchMap)', async () => {
            const secondWettbewerbskontext: PrivatpersonWettbewerbskontext = {
                anmeldungMoeglich: true,
                teilnahmerefs: [{ jahr: 2026, teilnahmenummer: 'P123456789' }],
            };

            store.overrideSelector(selectWettbewerbskontextLadenVerweigert, false);
            store.refreshState();

            const httpFirst$ = new Subject<PrivatpersonWettbewerbskontext>();
            const httpSecond$ = new Subject<PrivatpersonWettbewerbskontext>();
            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadPrivatpersonWettbewerbskontext
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.wettbewerbskontextLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(PrivatpersonActions.wettbewerbskontextLaden());

                expect(httpServiceMock.loadPrivatpersonWettbewerbskontext).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();

                action$.next(PrivatpersonActions.wettbewerbskontextLaden());

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadPrivatpersonWettbewerbskontext).toHaveBeenCalledTimes(2);

                httpFirst$.next(wettbewerbskontext);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                httpSecond$.next(secondWettbewerbskontext);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    PrivatpersonActions.wettbewerbskontextGeladen({ wettbewerbskontext: secondWettbewerbskontext }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effect stream alive after an error occurred (catchError inside switchMap)', async () => {
            store.overrideSelector(selectWettbewerbskontextLadenVerweigert, false);
            store.refreshState();

            const secondWettbewerbskontext: PrivatpersonWettbewerbskontext = {
                anmeldungMoeglich: true,
                teilnahmerefs: [{ jahr: 2026, teilnahmenummer: 'P123456789' }],
            };

            const httpFirst$ = new Subject<PrivatpersonWettbewerbskontext>();
            const httpSecond$ = new Subject<PrivatpersonWettbewerbskontext>();

            httpServiceMock.loadPrivatpersonWettbewerbskontext
                .mockReturnValueOnce(httpFirst$)
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const onError = vi.fn();
            const onComplete = vi.fn();

            const subscription = effects.wettbewerbskontextLaden$.subscribe({
                next: action => emittedActions.push(action),
                error: onError,
                complete: onComplete,
            });

            try {
                action$.next(PrivatpersonActions.wettbewerbskontextLaden());
                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    PrivatpersonActions.wettbewerbskontextLadenFailed({ error: httpServerErrorResponse }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);

                action$.next(PrivatpersonActions.wettbewerbskontextLaden());

                httpSecond$.next(secondWettbewerbskontext);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    PrivatpersonActions.wettbewerbskontextLadenFailed({ error: httpServerErrorResponse }),
                    PrivatpersonActions.wettbewerbskontextGeladen({ wettbewerbskontext: secondWettbewerbskontext }),
                ]);
                expect(onError).not.toHaveBeenCalled();
                expect(onComplete).not.toHaveBeenCalled();
                expect(subscription.closed).toBe(false);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to wettbewerbskontextLadenFailed when the httpService returns another Error', async () => {
            store.overrideSelector(selectWettbewerbskontextLadenVerweigert, false);
            store.refreshState();

            const error = new Error('uiuiui!');

            httpServiceMock.loadPrivatpersonWettbewerbskontext.mockReturnValue(throwError(() => error));

            const promise = firstValueFrom(effects.wettbewerbskontextLaden$);

            action$.next(PrivatpersonActions.wettbewerbskontextLaden());
            const emitted = await promise;

            expect(emitted).toEqual(PrivatpersonActions.wettbewerbskontextLadenFailed({ error }));
            expect(httpServiceMock.loadPrivatpersonWettbewerbskontext).toHaveBeenCalledOnce();
        });
    });

    describe('wettbewerbskontextLadenFailed$', () => {
        it('should publish the technical error message for an HttpErrorResponse', async () => {
            const promise = firstValueFrom(effects.wettbewerbskontextLadenFailed$);

            action$.next(PrivatpersonActions.wettbewerbskontextLadenFailed({ error: httpServerErrorResponse }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
        });

        it('should publish the technical error message for another Error', async () => {
            const error = new Error('uiuiui!');
            const promise = firstValueFrom(effects.wettbewerbskontextLadenFailed$);

            action$.next(PrivatpersonActions.wettbewerbskontextLadenFailed({ error }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedErrorMessage);
        });

        it('should publish the mapped error message for a forbidden response', async () => {
            const error = new HttpErrorResponse({
                status: 403,
                statusText: 'Forbidden',
            });
            const promise = firstValueFrom(effects.wettbewerbskontextLadenFailed$);

            action$.next(PrivatpersonActions.wettbewerbskontextLadenFailed({ error }));
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Sie haben leider keine Berechtigung für diese Aktion'
            );
        });

        it('should be configured not to dispatch any action', () => {
            const metadata = getEffectsMetadata(effects);

            expect(metadata.wettbewerbskontextLadenFailed$?.dispatch).toBe(false);
        });

        it('should ignore unrelated actions', () => {
            const emittedActions: Action[] = [];
            const subscription = effects.wettbewerbskontextLadenFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(PrivatpersonActions.wettbewerbskontextLaden());

                expect(emittedActions).toEqual([]);
                expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('navigateOnWettbewerbOrganisieren$', () => {
        it('should be configured not to dispatch any action', () => {
            const metadata = getEffectsMetadata(effects);

            expect(metadata.navigateOnWettbewerbOrganisieren$?.dispatch).toBe(false);
        });

        it('should navigate to privatteilnahme', async () => {
            const promise = firstValueFrom(effects.navigateOnWettbewerbOrganisieren$);

            action$.next(PrivatpersonActions.wettbewerbOrganisieren());

            await promise;

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith([
                '/',
                'minikaenguru-anwendung',
                'privatperson',
                'privatteilnahme',
            ]);
        });
    });
});
