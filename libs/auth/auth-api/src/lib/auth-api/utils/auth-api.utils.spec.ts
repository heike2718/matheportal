import { AUTH_RESULT_STATE } from '@matheportal/auth-model';
import { getIdToken, mapHashToAuthResult, mapToAuthResultState } from './auth-api.utils';

describe('auth-api.utils', () => {
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

    describe('mapHashToAuthResult', () => {
        it('should return null when hash is empty', () => {
            const hash = '#';

            const result = mapHashToAuthResult(hash);

            expect(result).toBeNull();
        });

        it('should return null when hash is not oauthFlow', () => {
            const hash = '#state=login&nonce=&idToken=id-token';
            const result = mapHashToAuthResult(hash);

            expect(result).toBeNull();
        });

        it('should return login and id-token when both are present', () => {
            const hash = '#state=login&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'login',
                idToken: 'id-token',
            });
        });

        it('should return signup and idToken when both are present', () => {
            const hash = '#state=signup&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'signup',
                idToken: 'id-token',
            });
        });

        it('should return signup and idToken when idToken empty', () => {
            const hash = '#state=signup&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'signup',
                idToken: undefined,
            });
        });

        it('should return signup and undefined when idToken missing', () => {
            const hash = '#state=signup&nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'signup',
                idToken: undefined,
            });
        });

        it('should return invalid and idToken when state is empty', () => {
            const hash = '#state=&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'invalid',
                idToken: 'id-token',
            });
        });

        it('should return invalid and undefined when state and idToken are empty', () => {
            const hash = '#state=&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'invalid',
                idToken: undefined,
            });
        });

        it('should return invalid and undefined when state is empty and idToken missing', () => {
            const hash = '#state=&nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'invalid',
                idToken: undefined,
            });
        });

        it('should return invalid and id-token when state is missing', () => {
            const hash = '#&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'invalid',
                idToken: 'id-token',
            });
        });

        it('should return invalid and idToken undefined when state is missing and idToken is empty', () => {
            const hash = '#&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'invalid',
                idToken: undefined,
            });
        });

        it('should return invalid and undefined when both, state and idToken are missing', () => {
            const hash = '#nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'invalid',
                idToken: undefined,
            });
        });

        it('should return invalid and id-token, when state unknown', () => {
            const hash = '#state=foobar&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'invalid',
                idToken: 'id-token',
            });
        });

        it('should return invalid and undefine, when state unknown and idToken empty', () => {
            const hash = '#state=foobar&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'invalid',
                idToken: undefined,
            });
        });

        it('should return invalid and undefined, when state unknown and idToken missing', () => {
            const hash = '#state=foobar&nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';

            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'invalid',
                idToken: undefined,
            });
        });

        it('should return login and idToken undefined when state is login and idToken empty', () => {
            const hash = '#state=login&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';
            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'login',
                idToken: undefined,
            });
        });

        it('should return login, idToken undefined when state is login and idToken missing', () => {
            const hash = '#state=login&nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT';
            const result = mapHashToAuthResult(hash);

            expect(result).toEqual({
                state: 'login',
                idToken: undefined,
            });
        });
    });
});
