import { Action } from '@ngrx/store';
import { authFeature, AuthState } from './auth.reducer';
import { anonymousUser, User } from '@matheportal/auth-model';
import { authActions } from './auth.actions';

describe('authFeature tests', () => {
    const unknownAction = { type: 'unknownAction' } as Action;

    const user: User = {
        fullName: 'David Hilbert',
        roles: ['ADMIN'],
        anonym: false,
    };

    describe('auth-feature sanity checks', () => {
        it('should return the initial state, when unknown action and undefined state', () => {
            const state = authFeature.reducer(undefined, unknownAction);
            expect(state.user).toEqual(anonymousUser);
            expect(state.isSessionValidated).toBeFalsy();
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const state = authFeature.reducer({ user: user, isSessionValidated: true }, unknownAction);
            expect(state.user).toEqual(user);
            expect(state.isSessionValidated).toBeTruthy();
        });
    });

    describe('sessionValidated', () => {
        it('returns the expected state, when initialState and sessionValidated', () => {
            const actualState: AuthState = { user: anonymousUser, isSessionValidated: false };
            const state = authFeature.reducer(actualState, authActions.sessionValidated({ user: user }));
            expect(state.user).toEqual(user);
            expect(state.isSessionValidated).toBeTruthy();
        });
    });

    describe('sessionValidationFailed', () => {
        it('returns the initialState, when user and sessionValidationFailed', () => {
            const actualState: AuthState = { user: user, isSessionValidated: true };
            const state = authFeature.reducer(actualState, authActions.sessionValidationFailed({ reason: 'expired' }));
            expect(state.user).toEqual(anonymousUser);
            expect(state.isSessionValidated).toBeTruthy();
        });
    });

    describe('loggedOut', () => {
        it('returns the initialState, when user has logged out', () => {
            const actualState: AuthState = { user: user, isSessionValidated: true };
            const state = authFeature.reducer(actualState, authActions.loggedOut({ reason: 'useraction' }));
            expect(state.user).toEqual(anonymousUser);
            expect(state.isSessionValidated).toBeFalsy();
        });
    });
});
