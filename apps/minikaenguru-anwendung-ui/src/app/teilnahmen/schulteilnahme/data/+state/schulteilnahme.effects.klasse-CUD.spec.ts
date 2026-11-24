import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { Klasse, KlasseDialogData, KlasseDialogResult, KlasseRequest } from '../../model/klasse.model';
import { createSchulteilnahmeEffectsTestdaten } from './schulteilnahme.effects.testdaten';
import { setupSchulteilnahmeEffectsTest } from './schulteilnahme.effects.testsetup';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { KlasseDialogComponent } from '../../features/klasse-dialog/klasse-dialog.component';
import { Action } from '@ngrx/store';
import { getEffectsMetadata } from '@ngrx/effects';
import { mapToErrorContext } from '@matheportal/shared-utils';

describe('SchulteilnahmeEffects: klasse anlegen, ändern, loschen', () => {
    let context: ReturnType<typeof setupSchulteilnahmeEffectsTest>;

    const { klassen, klassenAndereSchule, fehler } = createSchulteilnahmeEffectsTestdaten();

    const schulkuerzel = 'S1234567';

    const klasseRequest: KlasseRequest = {
        name: 'Fuchsklasse',
    };

    beforeEach(() => {
        context = setupSchulteilnahmeEffectsTest();
    });

    describe('openDialogOnKlasseAnlegenRequested$', () => {
        const result: KlasseDialogResult = {
            schulkuerzel,
            name: 'Fuchsklasse',
        };

        it('should map to klasseAnlegen when dialog closed with result', async () => {
            const { action$, effects, dialogMock, closed$ } = context;

            const promise = firstValueFrom(effects.openDialogOnKlasseAnlegenRequested$);

            action$.next(SchulteilnahmeActions.klasseAnlegenRequested({ schulkuerzel }));
            closed$.next(result);

            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.klasseAnlegen({ schulkuerzel, klasseRequest }));
            expect(dialogMock.open).toHaveBeenCalledOnce();
            expect(dialogMock.open).toHaveBeenCalledWith(
                KlasseDialogComponent,
                expect.objectContaining({
                    data: {
                        schulkuerzel: 'S1234567',
                        name: '',
                        submitButtonLabel: 'anlegen',
                    } satisfies KlasseDialogData,
                })
            );
        });

        it('should ignore the second action while the first action is not finished (exhaustMap)', async () => {
            const { action$, effects, dialogMock, closed$ } = context;

            const emittedActions: Action[] = [];
            const subscription = effects.openDialogOnKlasseAnlegenRequested$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.klasseAnlegenRequested({ schulkuerzel }));

                expect(emittedActions).toEqual([]);
                expect(dialogMock.open).toHaveBeenCalledTimes(1);

                action$.next(SchulteilnahmeActions.klasseAnlegenRequested({ schulkuerzel: '7654321S' }));

                closed$.next(result);
                closed$.complete();

                expect(dialogMock.open).toHaveBeenCalledTimes(1);
                expect(dialogMock.open).toHaveBeenCalledWith(
                    KlasseDialogComponent,
                    expect.objectContaining({
                        data: {
                            schulkuerzel: 'S1234567',
                            name: '',
                            submitButtonLabel: 'anlegen',
                        } satisfies KlasseDialogData,
                    })
                );

                expect(emittedActions).toEqual([SchulteilnahmeActions.klasseAnlegen({ schulkuerzel, klasseRequest })]);

                const secondClosed$ = new Subject<KlasseDialogResult | undefined>();
                dialogMock.open.mockReturnValueOnce({ closed: secondClosed$ });

                action$.next(SchulteilnahmeActions.klasseAnlegenRequested({ schulkuerzel: '7654321S' }));

                secondClosed$.next({ ...result, schulkuerzel: '7654321S' });
                secondClosed$.complete();

                expect(dialogMock.open).toHaveBeenCalledTimes(2);
                expect(dialogMock.open).toHaveBeenLastCalledWith(
                    KlasseDialogComponent,
                    expect.objectContaining({
                        data: {
                            schulkuerzel: '7654321S',
                            name: '',
                            submitButtonLabel: 'anlegen',
                        } satisfies KlasseDialogData,
                    })
                );

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.klasseAnlegen({ schulkuerzel, klasseRequest }),
                    SchulteilnahmeActions.klasseAnlegen({ schulkuerzel: '7654321S', klasseRequest }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should open a dialog but dispatch no action when the dialog is cancelled', async () => {
            const { action$, effects, dialogMock, closed$ } = context;

            const emittedActions: Action[] = [];
            const subscription = effects.openDialogOnKlasseAnlegenRequested$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.klasseAnlegenRequested({ schulkuerzel }));

                closed$.next(undefined);
                closed$.complete();

                expect(dialogMock.open).toHaveBeenCalledTimes(1);
                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('klasseAnlegen$', () => {
        const klasse = klassen[0];
        const klasseAndereSchule = klassenAndereSchule[0];
        const schulkuerzel2 = '7654321S';

        const klasseRequest2: KlasseRequest = {
            name: klasseAndereSchule.name,
        };

        it('should call the httpService and map to klasseAngelegt', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.klasseAnlegen.mockReturnValueOnce(of(klasse));

            const promise = firstValueFrom(effects.klasseAnlegen$);

            action$.next(SchulteilnahmeActions.klasseAnlegen({ schulkuerzel, klasseRequest }));
            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.klasseAngelegt({ klasse }));
            expect(httpServiceMock.klasseAnlegen).toHaveBeenCalledOnce();
            expect(httpServiceMock.klasseAnlegen).toHaveBeenCalledWith(schulkuerzel, klasseRequest);
        });

        it('should call the httpService and map to klasseAnlegenFailed on error', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.klasseAnlegen.mockReturnValueOnce(throwError(() => fehler.http500));

            const promise = firstValueFrom(effects.klasseAnlegen$);

            action$.next(SchulteilnahmeActions.klasseAnlegen({ schulkuerzel, klasseRequest }));
            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.klasseAnlegenFailed({ schulkuerzel, error: fehler.http500 }));
            expect(httpServiceMock.klasseAnlegen).toHaveBeenCalledOnce();
            expect(httpServiceMock.klasseAnlegen).toHaveBeenCalledWith(schulkuerzel, klasseRequest);
        });

        it('should ignore actions during an active request and accept a new action after completion (exhaustMap)', () => {
            const { action$, effects, httpServiceMock } = context;

            const httpFirst$ = new Subject<Klasse>();
            const httpSecond$ = new Subject<Klasse>();

            httpServiceMock.klasseAnlegen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.klasseAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.klasseAnlegen({ schulkuerzel, klasseRequest }));

                expect(httpServiceMock.klasseAnlegen).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.klasseAnlegen).toHaveBeenNthCalledWith(1, schulkuerzel, klasseRequest);
                expect(emittedActions).toEqual([]);

                action$.next(
                    SchulteilnahmeActions.klasseAnlegen({
                        schulkuerzel: schulkuerzel2,
                        klasseRequest: klasseRequest2,
                    })
                );

                expect(httpServiceMock.klasseAnlegen).toHaveBeenCalledTimes(1);
                expect(emittedActions).toEqual([]);

                httpFirst$.next(klasse);
                httpFirst$.complete();

                expect(emittedActions).toEqual([SchulteilnahmeActions.klasseAngelegt({ klasse })]);

                // Die während des Requests eingegangene Action wird nicht nachträglich ausgeführt.
                expect(httpServiceMock.klasseAnlegen).toHaveBeenCalledTimes(1);

                action$.next(
                    SchulteilnahmeActions.klasseAnlegen({
                        schulkuerzel: schulkuerzel2,
                        klasseRequest: klasseRequest2,
                    })
                );

                expect(httpServiceMock.klasseAnlegen).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.klasseAnlegen).toHaveBeenNthCalledWith(2, schulkuerzel2, klasseRequest2);
                expect(emittedActions).toEqual([SchulteilnahmeActions.klasseAngelegt({ klasse })]);

                httpSecond$.next(klasseAndereSchule);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.klasseAngelegt({ klasse }),
                    SchulteilnahmeActions.klasseAngelegt({ klasse: klasseAndereSchule }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occurred', () => {
            const { action$, effects, httpServiceMock } = context;

            const httpFirst$ = new Subject<Klasse>();
            const httpSecond$ = new Subject<Klasse>();

            httpServiceMock.klasseAnlegen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.klasseAnlegen$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.klasseAnlegen({ schulkuerzel, klasseRequest }));

                httpFirst$.error(fehler.http500);

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.klasseAnlegenFailed({ schulkuerzel, error: fehler.http500 }),
                ]);

                action$.next(
                    SchulteilnahmeActions.klasseAnlegen({
                        schulkuerzel: schulkuerzel2,
                        klasseRequest: klasseRequest2,
                    })
                );

                expect(httpServiceMock.klasseAnlegen).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.klasseAnlegen).toHaveBeenLastCalledWith(schulkuerzel2, klasseRequest2);

                httpSecond$.next(klasseAndereSchule);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.klasseAnlegenFailed({ schulkuerzel, error: fehler.http500 }),
                    SchulteilnahmeActions.klasseAngelegt({ klasse: klasseAndereSchule }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('klasseAnlegenFailed$', () => {
        it('should be configured not to dispatch actions', () => {
            const metadata = getEffectsMetadata(context.effects);

            expect(metadata.klasseAnlegenFailed$?.dispatch).toBe(false);
        });

        it.each([
            { status: 401, error: fehler.http401 },
            { status: 409, error: fehler.http409 },
        ])('should show a warning when http-status is $status', async ({ error }) => {
            const { action$, effects, messagePublisherMock } = context;

            const errorContext = mapToErrorContext(error, false);

            const promise = firstValueFrom(effects.klasseAnlegenFailed$);

            action$.next(SchulteilnahmeActions.klasseAnlegenFailed({ schulkuerzel, error }));

            await promise;

            expect(messagePublisherMock.publishWarning).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishWarning).toHaveBeenCalledWith(errorContext.message);
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
        });

        it.each([
            { name: 'forbidden', error: fehler.http403 },
            { status: 'not found', error: fehler.http404 },
            { status: 'server error', error: fehler.http500 },
            { status: 'unexpected', error: fehler.unexpected },
        ])('should show an error when error is $name', async ({ error }) => {
            const { action$, effects, messagePublisherMock } = context;

            const errorContext = mapToErrorContext(error, false);

            const promise = firstValueFrom(effects.klasseAnlegenFailed$);

            action$.next(SchulteilnahmeActions.klasseAnlegenFailed({ schulkuerzel, error }));

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(errorContext.message);
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
        });
    });
});
