import { TestBed } from '@angular/core/testing';
import {
    ActivatedRouteSnapshot,
    GuardResult,
    MaybeAsync,
    provideRouter,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { BehaviorSubject, firstValueFrom, isObservable, Observable, Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { anonymousUser, User } from '@matheportal/auth-model';
import { raetselbaukastenAuthGuard } from './raetselbaukasten-auth.guard';
import { RESTRICTED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

describe('raetselbaukastenAuthGuard tests', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let portalSessionSubject: Subject<{ user: User; sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE }>;

    const portalSessionFacadeMock = {
        portalSession$: undefined as unknown as Observable<{
            user: User;
            sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE;
        }>,
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(portalSession: { user: User; sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE }) {
        portalSessionSubject = new BehaviorSubject<{ user: User; sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE }>(
            portalSession
        );
        portalSessionFacadeMock.portalSession$ = portalSessionSubject.asObservable();

        TestBed.configureTestingModule({
            providers: [provideRouter([]), { provide: PortalSessionFacade, useValue: portalSessionFacadeMock }],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should wait for portalSession before allowing access', async () => {
        const authorizedUser: User = {
            anonym: false,
            berechtigungen: ['STANDARD'],
            fullName: 'Bilbo',
        };
        setup({ user: anonymousUser, sessionLoadState: 'not-loaded' });

        const guardResult = TestBed.runInInjectionContext(() => raetselbaukastenAuthGuard()(route, state));

        if (!isObservable(guardResult)) {
            throw new Error('Expected guard to return an Observable');
        }

        const emittedResults: GuardResult[] = [];
        const onComplete = vi.fn();

        const subscription = guardResult.subscribe({
            next: result => emittedResults.push(result),
            complete: onComplete,
        });

        try {
            expect(emittedResults).toEqual([]);
            expect(onComplete).not.toHaveBeenCalled();

            // Session kommt an, user bekannt
            portalSessionSubject.next({ user: authorizedUser, sessionLoadState: 'loaded' });
            expect(emittedResults).toEqual([true]);
            expect(onComplete).toHaveBeenCalledOnce();
            expect(subscription.closed).toBe(true);
        } finally {
            subscription.unsubscribe();
        }
    });

    it('should redirect to ladefehler on technical error', async () => {
        const { router } = setup({ user: anonymousUser, sessionLoadState: 'technical-error' });

        const guardResult = TestBed.runInInjectionContext(() => raetselbaukastenAuthGuard()(route, state));

        const result = await resolveGuardResult(guardResult);
        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/raetselbaukasten/ladefehler');
    });

    it('should redirect guests to guests', async () => {
        const { router } = setup({ user: anonymousUser, sessionLoadState: 'unauthorized' });

        const guardResult = TestBed.runInInjectionContext(() => raetselbaukastenAuthGuard()(route, state));

        const result = await resolveGuardResult(guardResult);
        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/raetselbaukasten/guests');
    });
});
