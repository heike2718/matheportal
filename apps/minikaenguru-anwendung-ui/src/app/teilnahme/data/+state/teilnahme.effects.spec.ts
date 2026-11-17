import { Action, Store } from '@ngrx/store';
import { finalize, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { TeilnahmeEffects } from './teilnahme.effects';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { TeilnahmeHttpService } from '../teilnahme-http.service';
import { TeilnahmeActions } from './teilnahme.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectAnmeldendePersonLoadState, selectTeilnahme, selectTeilnahmeLoadState } from './teilnahme.selectors';
import { Auswertungsart, AUSWERUNGSART, Person, Teilnahme } from '../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { lehrpersonBerechtigungVerweigert } from '../../../lehrperson/api/lehrperson-store.events';
import { SchuleWettbewerbskontext } from '../../../schule/model/schule.model';
import { ANMELDESTATUS } from '../../../core/model/wettbewerbskontext.model';
import { selectSchuleWettbewerbskontext } from '../../../schule/api/public-schule.selectors';

describe('TeilnahmeEffects', () => {
    let action$: Subject<Action>;
    let effects: TeilnahmeEffects;
    let store: MockStore;

    const teilnahme: Teilnahme = {
        angemeldetAm: '27.02.2027',
        anzahlKinder: 56,
        anzahlKlassen: 2,
        anzahlLoesungszettel: 14,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
        jahr: 2027,
        kuerzel: 'S1234567',
    };

    let httpServiceMock: {
        loadAktuellePrivatteilnahme: ReturnType<typeof vi.fn>;
        privatAnmelden: ReturnType<typeof vi.fn>;
        loadAktuelleSchulteilnahme: ReturnType<typeof vi.fn>;
        schuleAnmelden: ReturnType<typeof vi.fn>;
        loadAnmeldendePerson: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishWarning: ReturnType<typeof vi.fn>; publishError: ReturnType<typeof vi.fn> };

    const notFoundResponse = new HttpErrorResponse({
        status: 404,
        statusText: 'NotFound',
        error: 'boom',
        url: '/teilnahme',
    });

    const forbidddenResponse = new HttpErrorResponse({
        status: 403,
        statusText: 'forbidden',
        error: 'boom',
        url: '/teilnahme',
    });

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/teilnahme',
    });

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        httpServiceMock = {
            loadAktuellePrivatteilnahme: vi.fn(),
            privatAnmelden: vi.fn(),
            loadAktuelleSchulteilnahme: vi.fn(),
            schuleAnmelden: vi.fn(),
            loadAnmeldendePerson: vi.fn(),
        };

        messagePublisherMock = {
            publishWarning: vi.fn(),
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                TeilnahmeEffects,
                provideMockStore(),
                provideMockActions(() => action$),
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
                {
                    provide: TeilnahmeHttpService,
                    useValue: httpServiceMock,
                },
            ],
        });

        effects = TestBed.inject(TeilnahmeEffects);
        store = TestBed.inject(Store) as MockStore;
        vi.clearAllMocks();
    });

    describe('ensurePrivatteilnahmeLoaded$', () => {
        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to privatteilnahmeLaden when loadState %s',
            async loadState => {
                store.overrideSelector(selectTeilnahmeLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensurePrivatteilnahmeLoaded$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(TeilnahmeActions.ensurePrivatteilnahmeLoaded());

                    expect(emittedActions).toEqual([TeilnahmeActions.privatteilnahmeLaden()]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it.each(['loaded', 'unauthorized'] as const)(
            'should not map to privatteilnahmeLaden when loadState %s',
            async loadState => {
                store.overrideSelector(selectTeilnahmeLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensurePrivatteilnahmeLoaded$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(TeilnahmeActions.ensurePrivatteilnahmeLoaded());

                    expect(emittedActions).toEqual([]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );
    });

    describe('privatteilnahmeLaden$', () => {
        it('should call the httpService and map to teilnahmeGeladen when 200', async () => {
            httpServiceMock.loadAktuellePrivatteilnahme.mockReturnValueOnce(of(teilnahme));

            const promise = firstValueFrom(effects.privatteilnahmeLaden$);

            action$.next(TeilnahmeActions.privatteilnahmeLaden());
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.teilnahmeGeladen({ teilnahme }));

            expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledOnce();
        });

        it('should switch to the latest action and cancel previos pending request (switchMap)', async () => {
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

            httpServiceMock.loadAktuellePrivatteilnahme
                .mockReturnValueOnce(httpFirst$.pipe(finalize(firstRequestFinalized)))
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.privatteilnahmeLaden());

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledTimes(1);

                action$.next(TeilnahmeActions.privatteilnahmeLaden());
                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledTimes(2);

                httpFirst$.next(firstResult);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                httpSecond$.next(secondResult);
                httpSecond$.complete();

                expect(emittedActions).toEqual([TeilnahmeActions.teilnahmeGeladen({ teilnahme: secondResult })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.loadAktuellePrivatteilnahme
                .mockReturnValueOnce(httpFirst$)
                .mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.privatteilnahmeLaden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeLadenFailed({
                        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                        error: httpServerErrorResponse,
                    }),
                ]);

                action$.next(TeilnahmeActions.privatteilnahmeLaden());

                expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeLadenFailed({
                        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                        error: httpServerErrorResponse,
                    }),
                    TeilnahmeActions.teilnahmeGeladen({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to teilnahmeLadenFailed error', async () => {
            httpServiceMock.loadAktuellePrivatteilnahme.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.privatteilnahmeLaden$);

            action$.next(TeilnahmeActions.privatteilnahmeLaden());
            const emitted = await promise;

            expect(emitted).toEqual(
                TeilnahmeActions.teilnahmeLadenFailed({
                    durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                    error: httpServerErrorResponse,
                })
            );

            expect(httpServiceMock.loadAktuellePrivatteilnahme).toHaveBeenCalledOnce();
        });
    });

    describe('teilnahmeAngemeldetOrGeladen$', () => {
        it('should map to ensureAnmeldendePersonGeladen when teilnahmeAngemeldet and durchfuehrungsart schule', async () => {
            const emittedActions: Action[] = [];
            const subscription = effects.teilnahmeAngemeldetOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }));

                expect(emittedActions).toEqual([
                    TeilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel: 'S1234567' }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to any action when teilnahmeAngemeldet and durchfuehrungsart privat', async () => {
            const emittedActions: Action[] = [];
            const subscription = effects.teilnahmeAngemeldetOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            const privatteilnahme: Teilnahme = { ...teilnahme, durchfuehrungsart: DURCHFUEHRUNGSART.privat };

            try {
                action$.next(TeilnahmeActions.teilnahmeAngemeldet({ teilnahme: privatteilnahme }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to ensureAnmeldendePersonGeladen when teilnahmeGeladen and durchfuehrungsart schule', async () => {
            const emittedActions: Action[] = [];
            const subscription = effects.teilnahmeAngemeldetOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.teilnahmeGeladen({ teilnahme }));

                expect(emittedActions).toEqual([
                    TeilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel: 'S1234567' }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to any action when teilnahmeGeladen and durchfuehrungsart privat', async () => {
            const emittedActions: Action[] = [];
            const subscription = effects.teilnahmeAngemeldetOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            const privatteilnahme: Teilnahme = { ...teilnahme, durchfuehrungsart: DURCHFUEHRUNGSART.privat };

            try {
                action$.next(TeilnahmeActions.teilnahmeGeladen({ teilnahme: privatteilnahme }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('ensureSchulteilnahmeLoaded$', () => {
        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to schulteilnahmeLaden when loadState %s',
            async loadState => {
                store.overrideSelector(selectTeilnahme, teilnahme);
                store.overrideSelector(selectTeilnahmeLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensureSchulteilnahmeLoaded$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(TeilnahmeActions.ensureSchulteilnahmeLoaded({ schulkuerzel: 'S1234567' }));

                    expect(emittedActions).toEqual([
                        TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'S1234567' }),
                    ]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it('should not map to schulteilnahmeLaden when loadState loaded and teilnahmekuerzel remains the same', async () => {
            store.overrideSelector(selectTeilnahme, teilnahme);
            store.overrideSelector(selectTeilnahmeLoadState, 'loaded');
            store.refreshState();

            const emittedActions: Action[] = [];

            const subscription = effects.ensureSchulteilnahmeLoaded$.subscribe({
                next: action => emittedActions.push(action),
            });

            try {
                action$.next(TeilnahmeActions.ensureSchulteilnahmeLoaded({ schulkuerzel: 'S1234567' }));

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should map to schulteilnahmeLaden when loaded and teilnahmekuerzel belongs to another school', async () => {
            store.overrideSelector(selectTeilnahme, teilnahme);
            store.overrideSelector(selectTeilnahmeLoadState, 'loaded');
            store.refreshState();

            const schulkuerzelB = '7654321S';

            const emittedActions: Action[] = [];

            const subscription = effects.ensureSchulteilnahmeLoaded$.subscribe({
                next: action => emittedActions.push(action),
            });

            try {
                action$.next(TeilnahmeActions.ensureSchulteilnahmeLoaded({ schulkuerzel: schulkuerzelB }));

                expect(emittedActions).toEqual([TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel: '7654321S' })]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('schulteilnahmeLaden$', () => {
        const schulkuerzel = 'S1234567';

        it('should call the httpService and map to teilnahmeGeladen when 200', async () => {
            httpServiceMock.loadAktuelleSchulteilnahme.mockReturnValueOnce(of(teilnahme));

            const promise = firstValueFrom(effects.schulteilnahmeLaden$);

            action$.next(TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.teilnahmeGeladen({ teilnahme }));

            expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledWith('S1234567');
        });

        it('should switch to the latest action and cancel previos pending request (switchMap)', async () => {
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
                action$.next(TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel: '7654321S' }));

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenLastCalledWith('7654321S');

                action$.next(TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel }));
                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenLastCalledWith('S1234567');

                httpFirst$.next(firstResult);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                httpSecond$.next(secondResult);
                httpSecond$.complete();

                expect(emittedActions).toEqual([TeilnahmeActions.teilnahmeGeladen({ teilnahme: secondResult })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.loadAktuelleSchulteilnahme.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.schulteilnahmeLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel: '7654321S' }));

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeLadenFailed({
                        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                        error: httpServerErrorResponse,
                    }),
                ]);

                action$.next(TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel }));

                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenLastCalledWith('S1234567');

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeLadenFailed({
                        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                        error: httpServerErrorResponse,
                    }),
                    TeilnahmeActions.teilnahmeGeladen({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to teilnahmeLadenFailed error', async () => {
            httpServiceMock.loadAktuelleSchulteilnahme.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.schulteilnahmeLaden$);

            action$.next(TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(
                TeilnahmeActions.teilnahmeLadenFailed({
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    error: httpServerErrorResponse,
                })
            );

            expect(httpServiceMock.loadAktuelleSchulteilnahme).toHaveBeenCalledOnce();
        });
    });

    describe('teilnahmeLadenFailed$', () => {
        it('should show the correct warning when http-status is 404 and not dispatch any action when durchfuehrungsart privat', async () => {
            const emittedActions: unknown[] = [];
            const subscription = effects.teilnahmeLadenFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(
                    TeilnahmeActions.teilnahmeLadenFailed({
                        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                        error: notFoundResponse,
                    })
                );

                expect(messagePublisherMock.publishWarning).toHaveBeenCalledOnce();
                expect(messagePublisherMock.publishWarning).toHaveBeenCalledWith(
                    'Sie sind noch nicht zum aktuellen Wettbewerb angemeldet.'
                );

                expect(messagePublisherMock.publishError).not.toHaveBeenCalled();

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should show the correct warning when http-status is 404 and not dispatch any action when durchfuehrungsart schule', async () => {
            const emittedActions: unknown[] = [];
            const subscription = effects.teilnahmeLadenFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(
                    TeilnahmeActions.teilnahmeLadenFailed({
                        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                        error: notFoundResponse,
                    })
                );

                expect(messagePublisherMock.publishWarning).toHaveBeenCalledOnce();
                expect(messagePublisherMock.publishWarning).toHaveBeenCalledWith(
                    'Die Schule ist noch nicht zum aktuellen Wettbewerb angemeldet.'
                );

                expect(messagePublisherMock.publishError).not.toHaveBeenCalled();

                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should show an error message and map to lehrpersonBerechtigungVerweigert when durchfuehrungsart schule and load state forbidden', async () => {
            const emittedActions: unknown[] = [];
            const subscription = effects.teilnahmeLadenFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(
                    TeilnahmeActions.teilnahmeLadenFailed({
                        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                        error: forbidddenResponse,
                    })
                );

                expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
                expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                    'Sie haben leider keine Berechtigung für diese Aktion.'
                );

                expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();

                expect(emittedActions).toEqual([lehrpersonBerechtigungVerweigert()]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it.each(['SCHULE', 'PRIVAT'] as const)(
            'should show an error when http-status is 500 and not dispatch any action when durchfuehrungsart %s',
            async durchfuehrungsart => {
                const emittedActions: unknown[] = [];
                const subscription = effects.teilnahmeLadenFailed$.subscribe(action => {
                    emittedActions.push(action);
                });

                try {
                    action$.next(
                        TeilnahmeActions.teilnahmeLadenFailed({
                            durchfuehrungsart,
                            error: httpServerErrorResponse,
                        })
                    );

                    expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
                    expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
                    );

                    expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
                } finally {
                    subscription.unsubscribe();
                }
            }
        );
    });

    describe('ensureAnmeldendePersonGeladen$', () => {
        const schulkuerzel = 'S1234567';

        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to anmeldendePersonLaden when teilnahmeGeladen and loadState %s',
            loadState => {
                store.overrideSelector(selectAnmeldendePersonLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];
                const subscription = effects.ensureAnmeldendePersonGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(TeilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel }));

                    expect(emittedActions).toEqual([TeilnahmeActions.anmeldendePersonLaden({ schulkuerzel })]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it.each(['loaded', 'not-found', 'unauthorized', 'forbidden'] as const)(
            'should not map to anmeldendePersonLaden when teilnahmeGeladen and loadState %s',
            loadState => {
                store.overrideSelector(selectAnmeldendePersonLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];
                const subscription = effects.ensureAnmeldendePersonGeladen$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(TeilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel }));

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
            httpServiceMock.loadAnmeldendePerson.mockReturnValueOnce(of(person));

            const promise = firstValueFrom(effects.anmeldendePersonLaden$);

            action$.next(TeilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.anmeldendePersonGeladen({ person }));

            expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledWith(schulkuerzel);
        });

        it('should switch to the latest action and cancel previous pending request (switchMap)', () => {
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
                action$.next(TeilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));

                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenNthCalledWith(1, schulkuerzel);

                action$.next(TeilnahmeActions.anmeldendePersonLaden({ schulkuerzel: schulkuerzel2 }));

                expect(firstRequestFinalized).toHaveBeenCalledOnce();
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenNthCalledWith(2, schulkuerzel2);

                httpFirst$.next(person);
                httpFirst$.complete();

                expect(emittedActions).toEqual([]);

                httpSecond$.next(secondResult);
                httpSecond$.complete();

                expect(emittedActions).toEqual([TeilnahmeActions.anmeldendePersonGeladen({ person: secondResult })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occurred', () => {
            const httpFirst$ = new Subject<Person>();
            const httpSecond$ = new Subject<Person>();

            httpServiceMock.loadAnmeldendePerson.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.anmeldendePersonLaden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    TeilnahmeActions.anmeldendePersonLadenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(TeilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));

                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenLastCalledWith(schulkuerzel);

                httpSecond$.next(person);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    TeilnahmeActions.anmeldendePersonLadenFailed({ error: httpServerErrorResponse }),
                    TeilnahmeActions.anmeldendePersonGeladen({ person }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to anmeldendePersonLadenFailed on error', async () => {
            httpServiceMock.loadAnmeldendePerson.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.anmeldendePersonLaden$);

            action$.next(TeilnahmeActions.anmeldendePersonLaden({ schulkuerzel }));
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.anmeldendePersonLadenFailed({ error: httpServerErrorResponse }));

            expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledOnce();
            expect(httpServiceMock.loadAnmeldendePerson).toHaveBeenCalledWith(schulkuerzel);
        });
    });

    describe('privatteilnahmeAnmelden$', () => {
        it('should call the httpService and map to teilnahmeAngemeldet', async () => {
            httpServiceMock.privatAnmelden.mockReturnValueOnce(of(teilnahme));

            const promise = firstValueFrom(effects.privatteilnahmeAnmelden$);

            action$.next(TeilnahmeActions.privatteilnahmeAnmelden());
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }));

            expect(httpServiceMock.privatAnmelden).toHaveBeenCalledOnce();
        });

        it('should ignore the second action while the first request is active (exhaustMap)', async () => {
            const httpFirst$ = new Subject<Teilnahme>();

            const firstRequestFinalized = vi.fn();
            const secondRequestFinalized = vi.fn();

            httpServiceMock.privatAnmelden.mockReturnValue(httpFirst$);

            const emittedActions: unknown[] = [];
            const subscription = effects.privatteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(emittedActions).toEqual([]);

                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(1);
                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(secondRequestFinalized).not.toHaveBeenCalled();
                expect(emittedActions).toEqual([]);

                httpFirst$.next(teilnahme);
                httpFirst$.complete();

                expect(emittedActions).toEqual([TeilnahmeActions.teilnahmeAngemeldet({ teilnahme })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should maps to teilnahmeAnmeldenFailed and keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.privatAnmelden.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                    TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should maps to teilnahmeAnmeldenFailed and keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.privatAnmelden.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                    TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.privatAnmelden.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                    TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to teilnahmeAnmeldenFailed on error', async () => {
            httpServiceMock.privatAnmelden.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.privatteilnahmeAnmelden$);

            action$.next(TeilnahmeActions.privatteilnahmeAnmelden());
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }));

            expect(httpServiceMock.privatAnmelden).toHaveBeenCalledOnce();
        });
    });

    describe('schulteilnahmeAnmelden$', () => {
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
            store.overrideSelector(selectSchuleWettbewerbskontext, wettbewerbskontext);
            store.refreshState();
        });

        it('should call the httpService and map to teilnahmeAngemeldet', async () => {
            httpServiceMock.schuleAnmelden.mockReturnValueOnce(of(teilnahme));

            const promise = firstValueFrom(effects.schulteilnahmeAnmelden$);

            action$.next(TeilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }));

            expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledOnce();
            expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledWith('S1234567', AUSWERUNGSART.offline);
        });

        it('should call the httpService but not map to teilnahmeAngemeldet when no wettbewerbskontext is loaded', async () => {
            store.overrideSelector(selectSchuleWettbewerbskontext, undefined);
            store.refreshState();

            httpServiceMock.schuleAnmelden.mockReturnValueOnce(of(teilnahme));

            const emittedActions: Action[] = [];
            const subscription = effects.schulteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledOnce();
                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledWith('S1234567', AUSWERUNGSART.offline);
                expect(emittedActions).toEqual([]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should not map to teilnahmeAngemeldet when the school context changes before the response arrives', async () => {
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
                action$.next(TeilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));

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

        it('should ignore the second action while the first request is active (exhaustMap)', async () => {
            const httpFirst$ = new Subject<Teilnahme>();

            const firstRequestFinalized = vi.fn();
            const secondRequestFinalized = vi.fn();

            httpServiceMock.schuleAnmelden.mockReturnValue(httpFirst$);

            const emittedActions: unknown[] = [];
            const subscription = effects.schulteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledWith('S1234567', AUSWERUNGSART.offline);
                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(emittedActions).toEqual([]);

                action$.next(
                    TeilnahmeActions.schulteilnahmeAnmelden({
                        schulkuerzel: schulkuerzel2,
                        auswertungsart: auswertungsart2,
                    })
                );

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledWith('S1234567', AUSWERUNGSART.offline);
                expect(firstRequestFinalized).not.toHaveBeenCalled();
                expect(secondRequestFinalized).not.toHaveBeenCalled();
                expect(emittedActions).toEqual([]);

                httpFirst$.next(teilnahme);
                httpFirst$.complete();

                expect(emittedActions).toEqual([TeilnahmeActions.teilnahmeAngemeldet({ teilnahme })]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should maps to teilnahmeAnmeldenFailed and keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.privatAnmelden.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.privatteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(TeilnahmeActions.privatteilnahmeAnmelden());

                expect(httpServiceMock.privatAnmelden).toHaveBeenCalledTimes(2);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                    TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should keep the effects stream alive after an error occured', async () => {
            const httpFirst$ = new Subject<Teilnahme>();
            const httpSecond$ = new Subject<Teilnahme>();

            httpServiceMock.schuleAnmelden.mockReturnValueOnce(httpFirst$).mockReturnValueOnce(httpSecond$);

            const emittedActions: Action[] = [];
            const subscription = effects.schulteilnahmeAnmelden$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(TeilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));

                httpFirst$.error(httpServerErrorResponse);

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                ]);

                action$.next(
                    TeilnahmeActions.schulteilnahmeAnmelden({
                        schulkuerzel: schulkuerzel2,
                        auswertungsart: auswertungsart2,
                    })
                );

                expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledTimes(2);
                expect(httpServiceMock.schuleAnmelden).toHaveBeenLastCalledWith('7654321S', AUSWERUNGSART.online);

                httpSecond$.next(teilnahme);
                httpSecond$.complete();

                expect(emittedActions).toEqual([
                    TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }),
                    TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }),
                ]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should call the httpService and map to teilnahmeAnmeldenFailed on error', async () => {
            httpServiceMock.schuleAnmelden.mockReturnValueOnce(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.schulteilnahmeAnmelden$);

            action$.next(TeilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel, auswertungsart }));
            const emitted = await promise;

            expect(emitted).toEqual(TeilnahmeActions.teilnahmeAnmeldenFailed({ error: httpServerErrorResponse }));

            expect(httpServiceMock.schuleAnmelden).toHaveBeenCalledOnce();
        });
    });

    describe('teilnahmeAnmeldenFailed$', () => {
        it('should show an error when http-status is 404 and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.teilnahmeAnmeldenFailed$);

            action$.next(
                TeilnahmeActions.teilnahmeAnmeldenFailed({
                    error: notFoundResponse,
                })
            );
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
            );

            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
        });
        it('should show an error when http-status is 500 and not dispatch any action', async () => {
            const promise = firstValueFrom(effects.teilnahmeAnmeldenFailed$);

            action$.next(
                TeilnahmeActions.teilnahmeAnmeldenFailed({
                    error: httpServerErrorResponse,
                })
            );
            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
            );

            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
        });
    });
});
