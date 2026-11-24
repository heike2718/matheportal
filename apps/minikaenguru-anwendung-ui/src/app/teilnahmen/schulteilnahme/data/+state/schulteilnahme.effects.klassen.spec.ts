import { Action } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { Teilnahme } from '../../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { Klasse } from '../../model/klasse.model';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { selectKlassenLoadState } from './schulteilnahme.selectors';
import { setupSchulteilnahmeEffectsTest } from './schulteilnahme.effects.testsetup';
import { createSchulteilnahmeEffectsTestdaten } from './schulteilnahme.effects.testdaten';

describe('SchulteilnahmeEffects: Klassen', () => {
    let context: ReturnType<typeof setupSchulteilnahmeEffectsTest>;

    const { teilnahme, fehler } = createSchulteilnahmeEffectsTestdaten();

    beforeEach(() => {
        context = setupSchulteilnahmeEffectsTest();
    });

    describe('ensureKlassenGeladenOnTeilnahmeAngemeldetOrGeladen$', () => {
        it('should map to ensureKlassenGeladen when teilnahmeAngemeldet and durchfuehrungsart schule', async () => {
            const { action$, effects } = context;
            const emittedActions: Action[] = [];
            const subscription = effects.ensureKlassenGeladenOnTeilnahmeAngemeldetOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme }));

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.ensureKlassenGeladen({ schulkuerzel: 'S1234567' }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to any action when teilnahmeAngemeldet and durchfuehrungsart privat', async () => {
            const { action$, effects } = context;
            const emittedActions: Action[] = [];
            const subscription = effects.ensureKlassenGeladenOnTeilnahmeAngemeldetOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            const privatteilnahme: Teilnahme = { ...teilnahme, durchfuehrungsart: DURCHFUEHRUNGSART.privat };

            try {
                action$.next(SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme: privatteilnahme }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to ensureKlassenGeladen when teilnahmeGeladen and durchfuehrungsart schule', async () => {
            const { action$, effects } = context;
            const emittedActions: Action[] = [];
            const subscription = effects.ensureKlassenGeladenOnTeilnahmeAngemeldetOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.teilnahmeGeladen({ teilnahme }));

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.ensureKlassenGeladen({ schulkuerzel: 'S1234567' }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to any action when teilnahmeGeladen and durchfuehrungsart privat', async () => {
            const { action$, effects } = context;
            const emittedActions: Action[] = [];
            const subscription = effects.ensureKlassenGeladenOnTeilnahmeAngemeldetOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            const privatteilnahme: Teilnahme = { ...teilnahme, durchfuehrungsart: DURCHFUEHRUNGSART.privat };

            try {
                action$.next(SchulteilnahmeActions.teilnahmeGeladen({ teilnahme: privatteilnahme }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('ensureKlassenGeladen$', () => {
        const schulkuerzel = 'S1234567';

        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to klassenLaden when loadState %s',
            loadState => {
                const { action$, effects, store } = context;

                store.overrideSelector(selectKlassenLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];
                const subscription = effects.ensureKlassenGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(SchulteilnahmeActions.ensureKlassenGeladen({ schulkuerzel }));

                    expect(emittedActions).toEqual([SchulteilnahmeActions.klassenLaden({ schulkuerzel })]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it.each(['loaded', 'not-found', 'unauthorized', 'forbidden'] as const)(
            'should not map to klassenLaden when loadState %s',
            loadState => {
                const { action$, effects, store } = context;

                store.overrideSelector(selectKlassenLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];
                const subscription = effects.ensureKlassenGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(SchulteilnahmeActions.ensureKlassenGeladen({ schulkuerzel }));

                    expect(emittedActions).toEqual([]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );
    });

    describe('klassenLaden$', () => {
        const schulkuerzel = 'S1234567';
        const schulkuerzel2 = '7654321S';

        const tuxklasse: Klasse = {
            name: 'Tuxklasse',
            schulkuerzel: 'S1234567',
            uuid: 'aaaaaa',
        };

        const fuchsklasse: Klasse = {
            name: 'Fuchsklasse',
            schulkuerzel: 'S1234567',
            uuid: 'bbbbbb',
        };

        const elsterklasse: Klasse = {
            name: 'Elsterklasse',
            schulkuerzel: '7654321S',
            uuid: '999999',
        };

        const klassenSchuleA: Klasse[] = [tuxklasse, fuchsklasse];
        const klassenSchuleB: Klasse[] = [elsterklasse];

        it('should call the httpService and map to klassenGeladen when 200', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.loadKlassen.mockReturnValueOnce(of(klassenSchuleA));

            const promise = firstValueFrom(effects.klassenLaden$);

            action$.next(SchulteilnahmeActions.klassenLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.klassenGeladen({ schulkuerzel, klassen: klassenSchuleA }));

            expect(httpServiceMock.loadKlassen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadKlassen).toHaveBeenCalledWith(schulkuerzel);
        });

        it('should switch to the latest action and cancel previous pending request (switchMap)', () => {
            const { action$, effects, httpServiceMock } = context;

            const httpFirst$ = new Subject<Klasse[]>();
            const httpSecond$ = new Subject<Klasse[]>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadKlassen
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.klassenLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.klassenLaden({ schulkuerzel }));

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadKlassen).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.loadKlassen).toHaveBeenNthCalledWith(1, schulkuerzel);

                action$.next(SchulteilnahmeActions.klassenLaden({ schulkuerzel: schulkuerzel2 }));

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadKlassen).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadKlassen).toHaveBeenNthCalledWith(2, schulkuerzel2);

                httpFirst$.next(klassenSchuleA);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                httpSecond$.next(klassenSchuleB);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.klassenGeladen({ schulkuerzel: schulkuerzel2, klassen: klassenSchuleB }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occurred', () => {
            const { action$, effects, httpServiceMock } = context;

            const httpFirst$ = new Subject<Klasse[]>();
            const httpSecond$ = new Subject<Klasse[]>();

            httpServiceMock.loadKlassen.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.klassenLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.klassenLaden({ schulkuerzel }));

                httpFirst$.error(fehler.http500);

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.klassenLadenFailed({ schulkuerzel, error: fehler.http500 }),
                ]);

                action$.next(SchulteilnahmeActions.klassenLaden({ schulkuerzel: schulkuerzel2 }));

                expect(httpServiceMock.loadKlassen).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadKlassen).toHaveBeenLastCalledWith(schulkuerzel2);

                httpSecond$.next(klassenSchuleB);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.klassenLadenFailed({ schulkuerzel, error: fehler.http500 }),
                    SchulteilnahmeActions.klassenGeladen({ schulkuerzel: schulkuerzel2, klassen: klassenSchuleB }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to klassenLadenFailed on error', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.loadKlassen.mockReturnValueOnce(throwError(() => fehler.http500));

            const promise = firstValueFrom(effects.klassenLaden$);

            action$.next(SchulteilnahmeActions.klassenLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.klassenLadenFailed({ schulkuerzel, error: fehler.http500 }));

            expect(httpServiceMock.loadKlassen).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadKlassen).toHaveBeenCalledWith(schulkuerzel);
        });
    });
});
