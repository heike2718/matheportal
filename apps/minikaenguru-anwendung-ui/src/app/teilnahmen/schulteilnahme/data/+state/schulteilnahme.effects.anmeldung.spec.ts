import { Action } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { Auswertungsart, AUSWERUNGSART, Teilnahme } from '../../../model/teilnahme.model';
import { selectSchuleWettbewerbskontext } from '../../../../schule/api/public-schule.selectors';
import { SchuleWettbewerbskontext } from '../../../../schule/model/schule.model';
import { ANMELDESTATUS } from '../../../../core/model/wettbewerbskontext.model';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { setupSchulteilnahmeEffectsTest } from './schulteilnahme.effects.testsetup';
import { createSchulteilnahmeEffectsTestdaten } from './schulteilnahme.effects.testdaten';

describe('SchulteilnahmeEffects: Anmeldung', () => {
    let context: ReturnType<typeof setupSchulteilnahmeEffectsTest>;

    const { teilnahme, fehler } = createSchulteilnahmeEffectsTestdaten();

    const schulkuerzel = 'S1234567';
    const auswertungsart: Auswertungsart = AUSWERUNGSART.offline;

    const schulkuerzel2 = '7654321S';
    const auswertungsart2: Auswertungsart = AUSWERUNGSART.online;

    const wettbewerbskontext: SchuleWettbewerbskontext = {
        anmeldestatus: ANMELDESTATUS.moeglich,
        kollegen: [],
        schule: {
            kuerzel: 'S1234567',
            name: 'Baumschule',
            ort: {
                land: {
                    kuerzel: 'DE-BB',
                    name: 'Brandenburg',
                    anzahlOrte: 456,
                },
                kuerzel: 'O1234567',
                name: 'Waldeck',
                anzahlSchulen: 13,
            },
        },
        teilnahmerefs: [],
        vertragDSGVOVorhanden: false,
    };

    beforeEach(() => {
        context = setupSchulteilnahmeEffectsTest();
        context.store.overrideSelector(selectSchuleWettbewerbskontext, wettbewerbskontext);
        context.store.refreshState();
    });

    describe('schulteilnahmeAnmelden$', () => {
        it('should call the httpService and map to teilnahmeAngemeldet', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.schuleAnmelden.mockReturnValueOnce(of(teilnahme));

            const promise = firstValueFrom(effects.schulteilnahmeAnmelden$);

            action$.next(SchulteilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));
            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme }));

            expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledOnce();
            expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledWith('S1234567', AUSWERUNGSART.offline);
        });

        it('should call the httpService but not map to teilnahmeAngemeldet when no wettbewerbskontext is loaded', async () => {
            const { action$, effects, store, httpServiceMock } = context;

            store.overrideSelector(selectSchuleWettbewerbskontext, undefined);
            store.refreshState();

            httpServiceMock.schuleAnmelden.mockReturnValueOnce(of(teilnahme));

            const emittedActions: Action[] = [];
            const subscription = effects.schulteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledOnce();
                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledWith('S1234567', AUSWERUNGSART.offline);
                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to teilnahmeAngemeldet when the school context changes before the response arrives', async () => {
            const { action$, effects, store, httpServiceMock } = context;

            const httpFirst$ = new Subject<Teilnahme>();

            httpServiceMock.schuleAnmelden.mockReturnValue(httpFirst$);

            const wettbewerbskontext2: SchuleWettbewerbskontext = {
                ...wettbewerbskontext,
                schule: { ...wettbewerbskontext.schule, kuerzel: '7654321S' },
            };

            const emittedActions: unknown[] = [];
            const subscription = effects.schulteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledWith('S1234567', AUSWERUNGSART.offline);
                expect(emittedActions).toEqual([]);

                store.overrideSelector(selectSchuleWettbewerbskontext, wettbewerbskontext2);
                store.refreshState();

                httpFirst$.next(teilnahme);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should ignore actions during an active request and accept a new action after completion (exhaustMap)', () => {
            const { action$, effects, httpServiceMock } = context;

            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            const firstRequestFinalized = vi.fn();
            const secondRequestFinalized = vi.fn();

            httpServiceMock.schuleAnmelden
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$.pipe(finalize(secondRequestFinalized)));

            const emittedActions: Action[] = [];
            const subscription = effects.schulteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.schuleAnmelden).toHaveBeenNthCalledWith(1, 'S1234567', AUSWERUNGSART.offline);
                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(emittedActions).toEqual([]);

                action$.next(
                    SchulteilnahmeActions.schulteilnahmeAnmelden({
                        schulkuerzel: schulkuerzel2,
                        auswertungsart: auswertungsart2,
                    })
                );

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(secondRequestFinalized).not.toHaveBeenCalled();
                expect(emittedActions).toEqual([]);

                httpFirst$.next(teilnahme);

                expect(emittedActions).toEqual([SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme })]);
                expect(firstRequestFinalized).not.toHaveBeenCalled();

                httpFirst$.complete();

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(secondRequestFinalized).not.toHaveBeenCalled();

                // Die während des Requests eingegangene Action wird nicht nachträglich ausgeführt.
                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledTimes(1);

                action$.next(
                    SchulteilnahmeActions.schulteilnahmeAnmelden({
                        schulkuerzel,
                        auswertungsart: auswertungsart2,
                    })
                );

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.schuleAnmelden).toHaveBeenNthCalledWith(2, 'S1234567', AUSWERUNGSART.online);
                expect(secondRequestFinalized).not.toHaveBeenCalled();
                expect(emittedActions).toEqual([SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme })]);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                    SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(secondRequestFinalized).toHaveBeenCalledOnce();
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occurred', async () => {
            const { action$, effects, httpServiceMock } = context;

            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.schuleAnmelden.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.schulteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));

                httpFirst$.error(fehler.http500);

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.teilnahmeAnmeldenFailed({ error: fehler.http500 }),
                ]);

                action$.next(
                    SchulteilnahmeActions.schulteilnahmeAnmelden({
                        schulkuerzel: schulkuerzel2,
                        auswertungsart: auswertungsart2,
                    })
                );

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.schuleAnmelden).toHaveBeenLastCalledWith('7654321S', AUSWERUNGSART.online);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.teilnahmeAnmeldenFailed({ error: fehler.http500 }),
                    SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to teilnahmeAnmeldenFailed on error', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.schuleAnmelden.mockReturnValueOnce(throwError(() => fehler.http500));

            const promise = firstValueFrom(effects.schulteilnahmeAnmelden$);

            action$.next(SchulteilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));
            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.teilnahmeAnmeldenFailed({ error: fehler.http500 }));

            expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledOnce();
        });
    });
});
