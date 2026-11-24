import { TestBed } from '@angular/core/testing';
import {
    ActivatedRouteSnapshot,
    convertToParamMap,
    GuardResult,
    MaybeAsync,
    provideRouter,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { BehaviorSubject, firstValueFrom, isObservable, Observable, Subject } from 'rxjs';
import { SchulteilnahmeFacade } from './schulteilnahme.facade';
import { mkaKlasseGuard } from './mka-klasse.guard';
import { Klasse } from '../model/klasse.model';

describe('mkaKlasseGuard', () => {
    const schulkuerzel = 'S1234567';
    const klasseId = 'abcdef';

    const klassen: Klasse[] = [
        {
            name: 'Fuchsklasse',
            schulkuerzel: 'S1234567',
            uuid: 'abcdef',
        },
        {
            name: 'Tuxklasse',
            schulkuerzel: 'S1234567',
            uuid: '123456',
        },
    ];

    let route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let klassenLoadStateAndKlassenSubject: Subject<{
        klassenLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
        klassen: Klasse[];
    }>;

    let teilnahmeFacadeMock: {
        klassenLoadStateAndKlassen$: Observable<{
            klassenLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
            klassen: Klasse[];
        }>;
        klassenLaden: ReturnType<typeof vi.fn>;
        klasseAusRouteErmittelt: ReturnType<typeof vi.fn>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(
        klassenLoadState: AUTHORIZED_RESOURCE_LOAD_STATE,
        klassen: Klasse[],
        schulkuerzel: string | undefined,
        klasseId: string | undefined
    ) {
        klassenLoadStateAndKlassenSubject = new BehaviorSubject<{
            klassenLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
            klassen: Klasse[];
        }>({ klassenLoadState, klassen });

        teilnahmeFacadeMock = {
            klassenLoadStateAndKlassen$: klassenLoadStateAndKlassenSubject.asObservable(),
            klassenLaden: vi.fn(),
            klasseAusRouteErmittelt: vi.fn(),
        };

        route = {
            paramMap: convertToParamMap({
                ...(schulkuerzel === undefined ? {} : { schulkuerzel }),
                ...(klasseId === undefined ? {} : { klasseId }),
            }),
        } as ActivatedRouteSnapshot;

        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                {
                    provide: SchulteilnahmeFacade,
                    useValue: teilnahmeFacadeMock,
                },
            ],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should navigate to lehrperson when schulkuerzel is undefined', async () => {
        const { router } = setup('not-loaded', [], undefined, klasseId);

        const result = await TestBed.runInInjectionContext(() => resolveGuardResult(mkaKlasseGuard()(route, state)));

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/lehrperson');
        expect(teilnahmeFacadeMock.klassenLaden).not.toHaveBeenCalled();
        expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).not.toHaveBeenCalled();
    });

    it('should navigate to schulteilnahme when klasseId is undefined', async () => {
        const { router } = setup('not-loaded', [], schulkuerzel, undefined);

        const result = await TestBed.runInInjectionContext(() => resolveGuardResult(mkaKlasseGuard()(route, state)));

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe(
            '/minikaenguru-anwendung/lehrperson/schule/S1234567/teilnahme'
        );
        expect(teilnahmeFacadeMock.klassenLaden).not.toHaveBeenCalled();
        expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).not.toHaveBeenCalled();
    });

    it('should dispatch klassenLaden and allow access and call klasseAusRouteErmittelt when klassenLoadState becomes loaded klasse is found', async () => {
        setup('not-loaded', [], schulkuerzel, klasseId);

        const resultPromise = TestBed.runInInjectionContext(() => resolveGuardResult(mkaKlasseGuard()(route, state)));

        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledOnce();
        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith('S1234567');

        klassenLoadStateAndKlassenSubject.next({ klassenLoadState: 'loaded', klassen });

        const result = await resultPromise;

        expect(result).toBe(true);

        expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).toHaveBeenCalledOnce();
        expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).toHaveBeenCalledWith({
            name: 'Fuchsklasse',
            schulkuerzel: 'S1234567',
            uuid: 'abcdef',
        });
    });

    it('should dispatch klassenLaden and navigate to teilnahme when klassenLoadState becomes loaded klasse is NOT found', async () => {
        const { router } = setup('not-loaded', [], schulkuerzel, '999999');

        const resultPromise = TestBed.runInInjectionContext(() => resolveGuardResult(mkaKlasseGuard()(route, state)));

        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledOnce();
        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith('S1234567');

        klassenLoadStateAndKlassenSubject.next({ klassenLoadState: 'loaded', klassen });

        const result = await resultPromise;

        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith(schulkuerzel);
        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe(
            '/minikaenguru-anwendung/lehrperson/schule/S1234567/teilnahme'
        );
        expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).not.toHaveBeenCalled();
    });

    it('should wait while klassenLoadState is not-loaded and then navigate to ladefehler', () => {
        const { router } = setup('not-loaded', [], schulkuerzel, klasseId);
        const onResult = vi.fn();
        const onError = vi.fn();
        const onComplete = vi.fn();

        const subscription = TestBed.runInInjectionContext(() => {
            const result = mkaKlasseGuard()(route, state);

            if (!isObservable(result)) {
                throw new Error('Expected guard to return an Observable');
            }

            return result.subscribe({
                next: onResult,
                error: onError,
                complete: onComplete,
            });
        });

        try {
            expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledOnce();
            expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith(schulkuerzel);

            expect(onResult).not.toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
            expect(onComplete).not.toHaveBeenCalled();

            klassenLoadStateAndKlassenSubject.next({
                klassenLoadState: 'not-loaded',
                klassen: [],
            });

            expect(onResult).not.toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
            expect(onComplete).not.toHaveBeenCalled();

            klassenLoadStateAndKlassenSubject.next({
                klassenLoadState: 'technical-error',
                klassen: [],
            });

            expect(onResult).toHaveBeenCalledOnce();

            // vi speichert calls in einem Array: erstes element [0] ist der erste Aufruf des mocks, [0] das erste Argument dieses Aufrufs.
            const result = onResult.mock.calls[0][0];
            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/ladefehler');

            expect(onError).not.toHaveBeenCalled();
            expect(onComplete).toHaveBeenCalledOnce();
            expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).not.toHaveBeenCalled();
        } finally {
            subscription.unsubscribe();
        }
    });

    it.each(['forbidden', 'not-found'] as const)(
        'should navigate to teilnahme when klassenLoadState becomes s%',
        async klassenLoadState => {
            const { router } = setup('not-loaded', [], schulkuerzel, klasseId);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaKlasseGuard()(route, state))
            );

            expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledOnce();
            expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith('S1234567');

            klassenLoadStateAndKlassenSubject.next({ klassenLoadState, klassen: [] });

            const result = await resultPromise;

            expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith(schulkuerzel);
            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe(
                '/minikaenguru-anwendung/lehrperson/schule/S1234567/teilnahme'
            );
            expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).not.toHaveBeenCalled();
        }
    );

    it('should navigate to ladefehler when klassenLoadState becomes technical-error', async () => {
        const { router } = setup('not-loaded', [], schulkuerzel, klasseId);

        const resultPromise = TestBed.runInInjectionContext(() => resolveGuardResult(mkaKlasseGuard()(route, state)));

        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledOnce();
        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith('S1234567');

        klassenLoadStateAndKlassenSubject.next({ klassenLoadState: 'technical-error', klassen: [] });

        const result = await resultPromise;

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/ladefehler');
    });

    it('should should allow access immediately when klassen already loaded and klasse is found', async () => {
        setup('loaded', klassen, schulkuerzel, klasseId);

        const resultPromise = TestBed.runInInjectionContext(() => resolveGuardResult(mkaKlasseGuard()(route, state)));

        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledOnce();
        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith('S1234567');

        const result = await resultPromise;

        expect(result).toBe(true);

        expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).toHaveBeenCalledOnce();
        expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).toHaveBeenCalledWith({
            name: 'Fuchsklasse',
            schulkuerzel: 'S1234567',
            uuid: 'abcdef',
        });
    });

    it('should should navigate to teilnahme immediately when klassen already loaded and klasse is NOT found', async () => {
        const { router } = setup('loaded', klassen, schulkuerzel, '999999');

        const resultPromise = TestBed.runInInjectionContext(() => resolveGuardResult(mkaKlasseGuard()(route, state)));

        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledOnce();
        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith('S1234567');

        const result = await resultPromise;

        expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith(schulkuerzel);
        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe(
            '/minikaenguru-anwendung/lehrperson/schule/S1234567/teilnahme'
        );

        expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).not.toHaveBeenCalledOnce();
    });

    it.each(['S1234567', '7654321S'])(
        'should trigger klassenLaden and immediately navigate to portal.home when klassenLoadState is unauthorized and schulkuerzel is %s',
        async theSchulkuerzel => {
            const { router } = setup('unauthorized', [], theSchulkuerzel, klasseId);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaKlasseGuard()(route, state))
            );

            const result = await resultPromise;

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/home');

            expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledOnce();
            expect(teilnahmeFacadeMock.klassenLaden).toHaveBeenCalledWith(theSchulkuerzel);
            expect(teilnahmeFacadeMock.klasseAusRouteErmittelt).not.toHaveBeenCalledOnce();
        }
    );
});
