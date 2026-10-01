import { anonymousUser, User } from '@matheportal/auth-model';
import { AuthState } from './auth.reducer';
import { fromAuth } from './auth.selectors';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

describe('fromAuth tests', () => {
    const standardUser: User = {
        anonym: false,
        fullName: 'Frodo Beutlin',
        berechtigungen: ['STANDARD', 'KL_ADMIN'],
    };

    const admin: User = {
        anonym: false,
        fullName: 'Ruth',
        berechtigungen: ['STANDARD', 'KL_ADMIN', 'ADMIN'],
    };

    it('should select user', () => {
        const state: AuthState = {
            user: standardUser,
            sessionLoadingState: 'loaded',
        };

        const result = fromAuth.user.projector(state);

        expect(result).toEqual(state.user);
    });

    it.each([])('should select the sessionLoadingState with %s', (loadState: RESOURCE_LOAD_STATE) => {
        const state: AuthState = {
            user: standardUser,
            sessionLoadingState: loadState,
        };

        const result = fromAuth.sessionLoadingState.projector(state);
        expect(result).toBe(loadState);
    });

    it('should select isAdmin when user is not logged in', () => {
        const state: AuthState = {
            user: anonymousUser,
            sessionLoadingState: 'unauthorized',
        };
        const result = fromAuth.isAdmin.projector(state.user);

        expect(result).toBe(false);
    });

    it('should select isAdmin when user is standard', () => {
        const state: AuthState = {
            user: standardUser,
            sessionLoadingState: 'loaded',
        };
        const result = fromAuth.isAdmin.projector(state.user);

        expect(result).toBe(false);
    });

    it('should select isAdmin when user is admin', () => {
        const state: AuthState = {
            user: admin,
            sessionLoadingState: 'loaded',
        };
        const result = fromAuth.isAdmin.projector(state.user);

        expect(result).toBe(true);
    });
});
