import { Action } from '@ngrx/store';
import { authFeature, AuthState } from './auth.reducer';
import { anonymousUser, User } from '@matheportal/auth-model';
import { authActions } from './auth.actions';

describe('authFeature tests', () => {
    const unknownAction = { type: 'unknownAction' } as Action;

    const user: User = {
        fullName: 'David Hilbert',
        berechtigungen: ['ADMIN'],
        anonym: false,
    };

    describe('auth-feature sanity checks', () => {
        it('should return the initial state, when unknown action and undefined state', () => {
            const state = authFeature.reducer(undefined, unknownAction);
            expect(state.user).toEqual(anonymousUser);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const state = authFeature.reducer({ user: user, sessionLoadingState: 'not-loaded' }, unknownAction);
            expect(state.user).toEqual(user);
        });
    });

    describe('sessionCreated', () => {
        it('returns the expected state, when initialState and sessionCreated', () => {
            const actualState: AuthState = { user: anonymousUser, sessionLoadingState: 'not-loaded' };
            const state = authFeature.reducer(actualState, authActions.sessionCreated({ user: user }));
            expect(state.user).toEqual(user);
            expect(state.sessionLoadingState).toEqual('loaded');
        });
    });

    describe('createSessionFailed', () => {
        it('returns the expected state, when initialState and createSessionFailed', () => {
            const actualState: AuthState = { user: anonymousUser, sessionLoadingState: 'not-loaded' };
            const state = authFeature.reducer(actualState, authActions.createSessionFailed());
            expect(state.user).toEqual(anonymousUser);
            expect(state.sessionLoadingState).toEqual('technical-error');
        });
    });

    describe('invalidOAuthFlowHash', () => {
        it('returns the expected state, when initialState and invalidOAuthFlowHash', () => {
            const actualState: AuthState = { user: anonymousUser, sessionLoadingState: 'not-loaded' };
            const state = authFeature.reducer(actualState, authActions.invalidOAuthFlowHash());
            expect(state.user).toEqual(anonymousUser);
            expect(state.sessionLoadingState).toEqual('technical-error');
        });
    });

    describe('signedUp', () => {
        it('returns the expected state, when loaded state and signedUp', () => {
            const actualState: AuthState = { user, sessionLoadingState: 'loaded' };
            const state = authFeature.reducer(actualState, authActions.signedUp());
            expect(state.user).toEqual(anonymousUser);
            expect(state.sessionLoadingState).toEqual('unauthorized');
        });
    });

    describe('sessionValidated', () => {
        it('returns the expected state, when initialState and sessionValidated', () => {
            const actualState: AuthState = { user: anonymousUser, sessionLoadingState: 'not-loaded' };
            const state = authFeature.reducer(actualState, authActions.sessionValidated({ user: user }));
            expect(state.user).toEqual(user);
            expect(state.sessionLoadingState).toEqual('loaded');
        });
    });

    describe('sessionValidationFailed', () => {
        it('returns the initialState, when user and sessionValidationFailed with expired', () => {
            const actualState: AuthState = { user: user, sessionLoadingState: 'loaded' };
            const state = authFeature.reducer(actualState, authActions.sessionValidationFailed({ reason: 'expired' }));
            expect(state.user).toEqual(anonymousUser);
            expect(state.sessionLoadingState).toEqual('unauthorized');
        });
        it('returns the initialState, when user and sessionValidationFailed with technical error', () => {
            const actualState: AuthState = { user: user, sessionLoadingState: 'loaded' };
            const state = authFeature.reducer(
                actualState,
                authActions.sessionValidationFailed({ reason: 'technical' })
            );
            expect(state.user).toEqual(anonymousUser);
            expect(state.sessionLoadingState).toEqual('technical-error');
        });
    });

    describe('sessionCreated', () => {
        it('returns the expected state, when initialState and sessionCreated', () => {
            const actualState: AuthState = { user: anonymousUser, sessionLoadingState: 'not-loaded' };
            const augmentedUser: User = {
                ...user,
                berechtigungen: [...user.berechtigungen, 'SCHULE'],
            };
            const state = authFeature.reducer(actualState, authActions.sessionCreated({ user: augmentedUser }));
            expect(state.user).toEqual(augmentedUser);
            expect(state.sessionLoadingState).toEqual('loaded');
        });
    });

    describe('loggedOut', () => {
        it('returns the initialState, when user has logged out', () => {
            const actualState: AuthState = { user: user, sessionLoadingState: 'loaded' };
            const state = authFeature.reducer(actualState, authActions.loggedOut());
            expect(state.user).toEqual(anonymousUser);
            expect(state.sessionLoadingState).toEqual('unauthorized');
        });
    });

    describe('ignored actions', () => {
        const actualState: AuthState = { user, sessionLoadingState: 'loaded' };

        it('should not listen to createSession', () => {
            const state = authFeature.reducer(actualState, authActions.createSession({ idToken: 'uquiq' }));
            expect(state).toBe(actualState);
        });
        it('should not listen to validateSession', () => {
            const state = authFeature.reducer(actualState, authActions.validateSession());
            expect(state).toBe(actualState);
        });
    });
});
