import { Action } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { Teilnahme } from '../../../model/teilnahme.model';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { selectTeilnahme, selectTeilnahmeLoadState } from './schulteilnahme.selectors';
import { setupSchulteilnahmeEffectsTest } from './schulteilnahme.effects.testsetup';
import { createSchulteilnahmeEffectsTestdaten } from './schulteilnahme.effects.testdaten';

describe('SchulteilnahmeEffects: Teilnahme laden', () => {
    let context: ReturnType<typeof setupSchulteilnahmeEffectsTest>;

    const { teilnahme, httpServerErrorResponse } = createSchulteilnahmeEffectsTestdaten();

    beforeEach(() => {
        context = setupSchulteilnahmeEffectsTest();
    });

    describe('ensureSchulteilnahmeGeladen$', () => {
        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to schulteilnahmeLaden when loadState %s',
            async loadState => {
                const { action$, effects, store } = context;

                store.overrideSelector(selectTeilnahme, teilnahme);
                store.overrideSelector(selectTeilnahmeLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];
                const subscription = effects.ensureSchulteilnahmeGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(SchulteilnahmeActions.ensureSchulteilnahmeGeladen({ schulkuerzel: 'S1234567' }));

                    expect(emittedActions).toEqual([
                        SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'S1234567' }),
                    ]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it('should not map to schulteilnahmeLaden when loadState loaded and teilnahmekuerzel remains the same', async () => {
            const { action$, effects, store } = context;

            store.overrideSelector(selectTeilnahme, teilnahme);
            store.overrideSelector(selectTeilnahmeLoadState, 'loaded');
            store.refreshState();

            const emittedActions: Action[] = [];
            const subscription = effects.ensureSchulteilnahmeGeladen$.subscribe({
                next: action => emittedActions.push(action),
            });

            try {
                action$.next(SchulteilnahmeActions.ensureSchulteilnahmeGeladen({ schulkuerzel: 'S1234567' }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to schulteilnahmeLaden when loaded and teilnahmekuerzel belongs to another school', async () => {
            const { action$, effects, store } = context;

            store.overrideSelector(selectTeilnahme, teilnahme);
            store.overrideSelector(selectTeilnahmeLoadState, 'loaded');
            store.refreshState();

            const schulkuerzelB = '7654321S';

            const emittedActions: Action[] = [];
            const subscription = effects.ensureSchulteilnahmeGeladen$.subscribe({
                next: action => emittedActions.push(action),
            });

            try {
                action$.next(SchulteilnahmeActions.ensureSchulteilnahmeGeladen({ schulkuerzel: schulkuerzelB }));

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: '7654321S' }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('schulteilnahmeLaden$', () => {
        const schulkuerzel = 'S1234567';

        it('should call the httpService and map to teilnahmeGeladen when 200', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.loadAktuelleSchulteilnahme.mockReturnValueOnce(of(teilnahme));

            const promise = firstValueFrom(effects.schulteilnahmeLaden$);

            action$.next(SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.teilnahmeGeladen({ teilnahme }));

            expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledWith('S1234567');
        });

        it('should switch to the latest action and cancel previous pending request (switchMap)', async () => {
            const { action$, effects, httpServiceMock } = context;

            const firstResult = teilnahme;

            const secondResult: Teilnahme = {
                ...teilnahme,
                anzahlKlassen: 3,
                anzahlKinder: 74,
                anzahlLoesungszettel: 38,
            };

            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadAktuelleSchulteilnahme
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.schulteilnahmeLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: '7654321S' }));

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenLastCalledWith('7654321S');

                action$.next(SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel }));

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenLastCalledWith('S1234567');

                httpFirst$.next(firstResult);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                httpSecond$.next(secondResult);
                httpSecond$.complete();

                expect(emittedActions).toEqual([SchulteilnahmeActions.teilnahmeGeladen({ teilnahme: secondResult })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occurred', async () => {
            const { action$, effects, httpServiceMock } = context;

            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.loadAktuelleSchulteilnahme.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.schulteilnahmeLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: '7654321S' }));

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel }));

                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenLastCalledWith('S1234567');

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }),
                    SchulteilnahmeActions.teilnahmeGeladen({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to teilnahmeLadenFailed on error', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.loadAktuelleSchulteilnahme.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.schulteilnahmeLaden$);

            action$.next(SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }));

            expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledOnce();
        });
    });
});
