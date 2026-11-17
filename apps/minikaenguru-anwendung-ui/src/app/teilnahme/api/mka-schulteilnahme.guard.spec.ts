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
import { TeilnahmeFacade } from './teilnahme.facade';
import { mkaSchulteilnahmeGuard } from './mka-schulteilnahme.guard';

describe('mkaSchulteilnahmeGuard', () => {
    const schulkuerzel = 'S1234567';
    let route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let teilnahmeLoadStateSubject: Subject<AUTHORIZED_RESOURCE_LOAD_STATE>;

    let teilnahmeFacadeMock: {
        teilnahmeLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE>;
        aktuelleSchulteilnahmeVorbereiten: ReturnType<typeof vi.fn>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(teilhameLoadState: AUTHORIZED_RESOURCE_LOAD_STATE, schulkuerzel: string | undefined) {
        teilnahmeLoadStateSubject = new BehaviorSubject<AUTHORIZED_RESOURCE_LOAD_STATE>(teilhameLoadState);

        teilnahmeFacadeMock = {
            teilnahmeLoadState$: teilnahmeLoadStateSubject.asObservable(),
            aktuelleSchulteilnahmeVorbereiten: vi.fn(),
        };

        route = {
            paramMap: convertToParamMap(schulkuerzel === undefined ? {} : { schulkuerzel }),
        } as ActivatedRouteSnapshot;

        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                {
                    provide: TeilnahmeFacade,
                    useValue: teilnahmeFacadeMock,
                },
            ],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should trigger preparation and allow access when teilnahme arrives later', async () => {
        setup('not-loaded', schulkuerzel);

        const resultPromise = TestBed.runInInjectionContext(() =>
            resolveGuardResult(mkaSchulteilnahmeGuard()(route, state))
        );

        expect(teilnahmeFacadeMock.aktuelleSchulteilnahmeVorbereiten).toHaveBeenCalledOnce();
        expect(teilnahmeFacadeMock.aktuelleSchulteilnahmeVorbereiten).toHaveBeenCalledWith('S1234567');

        teilnahmeLoadStateSubject.next('loaded');

        const result = await resultPromise;

        expect(result).toBe(true);
    });

    it.each(['unauthorized', 'forbidden', 'not-found'] as const)(
        'should navigate to DashboardSchule when state is %s',
        async loadState => {
            const { router } = setup(loadState, schulkuerzel);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaSchulteilnahmeGuard()(route, state))
            );

            const result = await resultPromise;

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/lehrperson/schule/S1234567');
        }
    );

    it('should navigate to ladefehler when technical-error', async () => {
        const { router } = setup('technical-error', schulkuerzel);

        const resultPromise = TestBed.runInInjectionContext(() =>
            resolveGuardResult(mkaSchulteilnahmeGuard()(route, state))
        );

        const result = await resultPromise;

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/ladefehler');
    });

    it('should allow access when teilnahme is already loaded', async () => {
        setup('loaded', schulkuerzel);

        const result = await TestBed.runInInjectionContext(() =>
            resolveGuardResult(mkaSchulteilnahmeGuard()(route, state))
        );

        expect(result).toBe(true);
        expect(teilnahmeFacadeMock.aktuelleSchulteilnahmeVorbereiten).toHaveBeenCalledOnce();
    });

    it('should navigate to dashbiard lehrperson when schulkuerzel is undefined', async () => {
        const { router } = setup('not-loaded', undefined);

        const result = await TestBed.runInInjectionContext(() =>
            resolveGuardResult(mkaSchulteilnahmeGuard()(route, state))
        );

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/lehrperson');
        expect(teilnahmeFacadeMock.aktuelleSchulteilnahmeVorbereiten).not.toHaveBeenCalled();
    });
});
