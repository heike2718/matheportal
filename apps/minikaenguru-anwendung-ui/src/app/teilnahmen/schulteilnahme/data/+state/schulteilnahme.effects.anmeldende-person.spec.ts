import { Action } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { Person, Teilnahme } from '../../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { selectAnmeldendePersonLoadState } from './schulteilnahme.selectors';
import { setupSchulteilnahmeEffectsTest } from './schulteilnahme.effects.testsetup';
import { createSchulteilnahmeEffectsTestdaten } from './schulteilnahme.effects.testdaten';

describe('SchulteilnahmeEffects: anmeldende Person', () => {
    let context: ReturnType<typeof setupSchulteilnahmeEffectsTest>;

    const { teilnahme, fehler } = createSchulteilnahmeEffectsTestdaten();

    beforeEach(() => {
        context = setupSchulteilnahmeEffectsTest();
    });

    describe('ensureAnmeldendePersonGeladenOnTeilnahmeAngemeldetOrGeladen$', () => {
        it('should map to ensureAnmeldendePersonGeladen when teilnahmeAngemeldet and durchfuehrungsart schule', async () => {
            const { action$, effects } = context;
            const emittedActions: Action[] = [];
            const subscription = effects.ensureAnmeldendePersonGeladenOnTeilnahmeAngemeldetOrGeladen$.subscribe(
                action => {
                    emittedActions.push(action);
                }
            );

            try {
                action$.next(SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme }));

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel: 'S1234567' }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to any action when teilnahmeAngemeldet and durchfuehrungsart privat', async () => {
            const { action$, effects } = context;
            const emittedActions: Action[] = [];
            const subscription = effects.ensureAnmeldendePersonGeladenOnTeilnahmeAngemeldetOrGeladen$.subscribe(
                action => {
                    emittedActions.push(action);
                }
            );

            const privatteilnahme: Teilnahme = { ...teilnahme, durchfuehrungsart: DURCHFUEHRUNGSART.privat };

            try {
                action$.next(SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme: privatteilnahme }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to ensureAnmeldendePersonGeladen when teilnahmeGeladen and durchfuehrungsart schule', async () => {
            const { action$, effects } = context;
            const emittedActions: Action[] = [];
            const subscription = effects.ensureAnmeldendePersonGeladenOnTeilnahmeAngemeldetOrGeladen$.subscribe(
                action => {
                    emittedActions.push(action);
                }
            );

            try {
                action$.next(SchulteilnahmeActions.teilnahmeGeladen({ teilnahme }));

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel: 'S1234567' }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to any action when teilnahmeGeladen and durchfuehrungsart privat', async () => {
            const { action$, effects } = context;
            const emittedActions: Action[] = [];
            const subscription = effects.ensureAnmeldendePersonGeladenOnTeilnahmeAngemeldetOrGeladen$.subscribe(
                action => {
                    emittedActions.push(action);
                }
            );

            const privatteilnahme: Teilnahme = { ...teilnahme, durchfuehrungsart: DURCHFUEHRUNGSART.privat };

            try {
                action$.next(SchulteilnahmeActions.teilnahmeGeladen({ teilnahme: privatteilnahme }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('ensureAnmeldendePersonGeladen$', () => {
        const schulkuerzel = 'S1234567';

        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to anmeldendePersonLaden when loadState %s',
            loadState => {
                const { action$, effects, store } = context;

                store.overrideSelector(selectAnmeldendePersonLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];
                const subscription = effects.ensureAnmeldendePersonGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(SchulteilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel }));

                    expect(emittedActions).toEqual([SchulteilnahmeActions.anmeldendePersonLaden({ schulkuerzel })]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it.each(['loaded', 'not-found', 'unauthorized', 'forbidden'] as const)(
            'should not map to anmeldendePersonLaden when loadState %s',
            loadState => {
                const { action$, effects, store } = context;

                store.overrideSelector(selectAnmeldendePersonLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];
                const subscription = effects.ensureAnmeldendePersonGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(SchulteilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel }));

                    expect(emittedActions).toEqual([]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );
    });

    describe('anmeldendePersonLaden$', () => {
        const schulkuerzel = 'S1234567';
        const schulkuerzel2 = '7654321S';

        const person: Person = {
            schulkuerzel,
            fullName: 'Rita Reihe',
        };

        it('should call the httpService and map to anmeldendePersonGeladen when 200', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.loadAnmeldendePerson.mockReturnValueOnce(of(person));

            const promise = firstValueFrom(effects.anmeldendePersonLaden$);

            action$.next(SchulteilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(SchulteilnahmeActions.anmeldendePersonGeladen({ person }));

            expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledWith(schulkuerzel);
        });

        it('should switch to the latest action and cancel previous pending request (switchMap)', () => {
            const { action$, effects, httpServiceMock } = context;

            const secondResult: Person = {
                schulkuerzel: schulkuerzel2,
                fullName: 'Anton Anzahl',
            };

            const httpFirst$ = new Subject<Person>();
            const httpSecond$ = new Subject<Person>();

            const firstRequestFinalized = vi.fn();

            httpServiceMock.loadAnmeldendePerson
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.anmeldendePersonLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenNthCalledWith(1, schulkuerzel);

                action$.next(SchulteilnahmeActions.anmeldendePersonLaden({ schulkuerzel: schulkuerzel2 }));

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenNthCalledWith(2, schulkuerzel2);

                httpFirst$.next(person);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                httpSecond$.next(secondResult);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.anmeldendePersonGeladen({ person: secondResult }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occurred', () => {
            const { action$, effects, httpServiceMock } = context;

            const httpFirst$ = new Subject<Person>();
            const httpSecond$ = new Subject<Person>();

            httpServiceMock.loadAnmeldendePerson.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.anmeldendePersonLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));

                httpFirst$.error(fehler.http500);

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.anmeldendePersonLadenFailed({ schulkuerzel, error: fehler.http500 }),
                ]);

                action$.next(SchulteilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));

                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenLastCalledWith(schulkuerzel);

                httpSecond$.next(person);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    SchulteilnahmeActions.anmeldendePersonLadenFailed({ schulkuerzel, error: fehler.http500 }),
                    SchulteilnahmeActions.anmeldendePersonGeladen({ person }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to anmeldendePersonLadenFailed on error', async () => {
            const { action$, effects, httpServiceMock } = context;

            httpServiceMock.loadAnmeldendePerson.mockReturnValueOnce(throwError(() => fehler.http500));

            const promise = firstValueFrom(effects.anmeldendePersonLaden$);

            action$.next(SchulteilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(
                SchulteilnahmeActions.anmeldendePersonLadenFailed({ schulkuerzel, error: fehler.http500 })
            );

            expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledWith(schulkuerzel);
        });
    });
});
