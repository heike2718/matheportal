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
            const state = authFeature.reducer({ user: user }, unknownAction);
            expect(state.user).toEqual(user);
        });
    });

    describe('sessionCreated', () => {
        it('returns the expected state, when initialState and sessionCreated', () => {
            const actualState: AuthState = { user: anonymousUser };
            const state = authFeature.reducer(actualState, authActions.sessionCreated({ user: user }));
            expect(state.user).toEqual(user);
        });
    });

    describe('createSessionFailed', () => {
        it('returns the expected state, when initialState and createSessionFailed', () => {
            const actualState: AuthState = { user: anonymousUser };
            const state = authFeature.reducer(actualState, authActions.createSessionFailed());
            expect(state.user).toEqual(anonymousUser);
        });
    });

    describe('sessionValidated', () => {
        it('returns the expected state, when initialState and sessionValidated', () => {
            const actualState: AuthState = { user: anonymousUser };
            const state = authFeature.reducer(actualState, authActions.sessionValidated({ user: user }));
            expect(state.user).toEqual(user);
        });
    });

    describe('sessionValidationFailed', () => {
        it('returns the initialState, when user and sessionValidationFailed', () => {
            const actualState: AuthState = { user: user };
            const state = authFeature.reducer(actualState, authActions.sessionValidationFailed({ reason: 'expired' }));
            expect(state.user).toEqual(anonymousUser);
        });
    });

    describe('loggedOut', () => {
        it('returns the initialState, when user has logged out', () => {
            const actualState: AuthState = { user: user };
            const state = authFeature.reducer(actualState, authActions.loggedOut());
            expect(state.user).toEqual(anonymousUser);
        });
    });
});
