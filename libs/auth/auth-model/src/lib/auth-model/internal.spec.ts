import { AUTH_RESULT_STATE } from './auth.model';
import { getIdToken, mapToAuthResultState } from './internal';

describe('mapToAuthResultState', () => {
    it('should return invalid when parameter is null', () => {
        const result: AUTH_RESULT_STATE = mapToAuthResultState(null);
        expect(result).toBe('invalid');
    });

    it('should return login when parameter is login', () => {
        const result: AUTH_RESULT_STATE = mapToAuthResultState('login');
        expect(result).toBe('login');
    });

    it('should return signup when parameter is signup', () => {
        const result: AUTH_RESULT_STATE = mapToAuthResultState('signup');
        expect(result).toBe('signup');
    });
});

describe('getIdToken', () => {
    it('should return undefined when parameter null', () => {
        const result = getIdToken(null);
        expect(result).toBeUndefined();
    });
    it('should return undefined when parameter undefined', () => {
        const result = getIdToken(undefined);
        expect(result).toBeUndefined();
    });
    it('should return undefined when parameter is empty', () => {
        const result = getIdToken('   ');
        expect(result).toBeUndefined();
    });
    it('should return the idToken when parameter is not undefined and not null', () => {
        const result = getIdToken(' id-token-123 ');
        expect(result).toBe('id-token-123');
    });
});
