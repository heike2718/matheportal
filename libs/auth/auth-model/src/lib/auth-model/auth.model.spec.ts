import { anonymousUser, LOCATION_HASH_SERVICE, mapHashToAuthResult, User } from './auth.model';
import { TestBed } from '@angular/core/testing';

describe('LOCATION_HASH_SERVICE', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
        window.history.replaceState(null, document.title, '/test-page?foo=bar');
    });
    it('should read window.location.hash', () => {
        window.history.replaceState(null, document.title, '/test-page?foo=bar#state=login&idToken=abc');

        const service = TestBed.inject(LOCATION_HASH_SERVICE);

        expect(service.read()).toBe('#state=login&idToken=abc');
    });

    it('should clear window.location.hash and keep path and query params', () => {
        window.history.replaceState(null, document.title, '/test-page?foo=bar#state=login&idToken=abc');

        const service = TestBed.inject(LOCATION_HASH_SERVICE);

        service.clear();

        expect(window.location.pathname).toBe('/test-page');
        expect(window.location.search).toBe('?foo=bar');
        expect(window.location.hash).toBe('');
    });
});

describe('anonymousUser', () => {
    it('anonymousUser is as expected', () => {
        const gast: User = anonymousUser;
        expect(gast.anonym).toBeTruthy();
        expect(gast.berechtigungen.length).toBe(0);
        expect(gast.fullName).toBe('Gast');
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
