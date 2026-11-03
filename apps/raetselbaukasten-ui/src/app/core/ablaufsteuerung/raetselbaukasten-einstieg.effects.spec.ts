import { Action } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { RaetselbaukastenEinstiegEffects } from './raetselbaukasten-einstieg.effects';
import { TestBed } from '@angular/core/testing';
import { anonymousUser, User } from '@matheportal/auth-model';
import { RESTRICTED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Router } from '@angular/router';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { RaetselbaukastenEinstiegActions } from './raetselbaukasten-einstieg.actions';

describe('RaetselbaukastenEinstiegEffects', () => {
    let action$: Subject<Action>;
    let effects: RaetselbaukastenEinstiegEffects;

    let routerMock: { navigate: ReturnType<typeof vi.fn> };

    let portalSessionSubject: Subject<{ user: User; sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE }>;

    let portalSessionFacadeMock: {
        portalSession$: Observable<{ user: User; sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE }>;
    };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        routerMock = {
            navigate: vi.fn(),
        };

        portalSessionSubject = new BehaviorSubject<{ user: User; sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE }>({
            user: anonymousUser,
            sessionLoadState: 'not-loaded',
        });

        portalSessionFacadeMock = {
            portalSession$: portalSessionSubject.asObservable(),
        };

        TestBed.configureTestingModule({
            providers: [
                RaetselbaukastenEinstiegEffects,
                provideMockActions(() => action$),
                { provide: Router, useValue: routerMock },
                {
                    provide: PortalSessionFacade,
                    useValue: portalSessionFacadeMock,
                },
            ],
        });

        effects = TestBed.inject(RaetselbaukastenEinstiegEffects);
    });

    describe('navigateOnRootEinstiegRequested$', async () => {
        it('should navigate to guests when Guest', async () => {
            const promise = firstValueFrom(effects.navigateOnRootEinstiegRequested$);

            action$.next(RaetselbaukastenEinstiegActions.rootEinstiegRequested());

            portalSessionSubject.next({ user: anonymousUser, sessionLoadState: 'loaded' });

            await promise;

            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'raetselbaukasten', 'guests']);
        });
        it('should navigate to dashboard for authenticated user', async () => {
            const promise = firstValueFrom(effects.navigateOnRootEinstiegRequested$);

            action$.next(RaetselbaukastenEinstiegActions.rootEinstiegRequested());

            portalSessionSubject.next({
                user: { anonym: false, berechtigungen: ['STANDARD'], fullName: 'Bilbo' },
                sessionLoadState: 'loaded',
            });

            await promise;

            expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'raetselbaukasten', 'dashboard']);
        });
        it('should cancel the pending root entry when a new root entry is requested (switchMap)', async () => {
            const subscription = effects.navigateOnRootEinstiegRequested$.subscribe();

            try {
                action$.next(RaetselbaukastenEinstiegActions.rootEinstiegRequested());

                portalSessionSubject.next({ user: anonymousUser, sessionLoadState: 'loaded' });

                portalSessionSubject.next({
                    user: { anonym: false, berechtigungen: ['STANDARD'], fullName: 'Bilbo' },
                    sessionLoadState: 'loaded',
                });

                expect(routerMock.navigate).toHaveBeenCalledTimes(1);
                expect(routerMock.navigate).toHaveBeenLastCalledWith(['/', 'raetselbaukasten', 'guests']);

                action$.next(RaetselbaukastenEinstiegActions.rootEinstiegRequested());

                expect(routerMock.navigate).toHaveBeenCalledTimes(2);
                expect(routerMock.navigate).toHaveBeenLastCalledWith(['/', 'raetselbaukasten', 'dashboard']);
            } finally {
                subscription.unsubscribe();
            }
        });
    });
});
