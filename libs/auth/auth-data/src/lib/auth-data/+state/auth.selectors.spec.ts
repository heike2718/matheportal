import { anonymousUser, User } from '@matheportal/auth-model';
import { AuthState } from './auth.reducer';
import { fromAuth } from './auth.selectors';

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
        };

        const result = fromAuth.user.projector(state);

        expect(result).toEqual(state.user);
    });

    it('should select hasSession when user is anonym', () => {
        const state: AuthState = {
            user: anonymousUser,
        };

        const result = fromAuth.hasSession.projector(state);

        expect(result).toBe(false);
    });

    it('should select hasSession when user is logged in', () => {
        const state: AuthState = {
            user: standardUser,
        };

        const result = fromAuth.hasSession.projector(state);

        expect(result).toBe(true);
    });

    it('should select isAdmin when user is not logged in', () => {
        const state: AuthState = {
            user: anonymousUser,
        };
        const result = fromAuth.isAdmin.projector(state.user);

        expect(result).toBe(false);
    });

    it('should select isAdmin when user is standard', () => {
        const state: AuthState = {
            user: standardUser,
        };
        const result = fromAuth.isAdmin.projector(state.user);

        expect(result).toBe(false);
    });

    it('should select isAdmin when user is admin', () => {
        const state: AuthState = {
            user: admin,
        };
        const result = fromAuth.isAdmin.projector(state.user);

        expect(result).toBe(true);
    });
});
