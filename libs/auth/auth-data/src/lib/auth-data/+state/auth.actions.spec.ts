import type { User } from '@matheportal/auth-model';
import { describe, expect, it } from 'vitest';

import { authActions } from './auth.actions';

describe('authActions', () => {
    const user: User = {
        fullName: 'Ada Lovelace',
        berechtigungen: ['ADMIN'],
        anonym: false,
    };

    it('should create requestLoginUrl action', () => {
        const action = authActions.requestLoginUrl();

        expect(action).toEqual({
            type: '[MP Auth] requestLoginUrl',
        });
    });

    it('should create requestLoginUrlFailed action', () => {
        const action = authActions.requestLoginUrlFailed();

        expect(action).toEqual({
            type: '[MP Auth] requestLoginUrlFailed',
        });
    });

    it('should create requestSignupUrl action', () => {
        const action = authActions.requestSignupUrl();

        expect(action).toEqual({
            type: '[MP Auth] requestSignupUrl',
        });
    });

    it('should create requestSignupUrlFailed action', () => {
        const action = authActions.requestSignupUrlFailed();

        expect(action).toEqual({
            type: '[MP Auth] requestSignupUrlFailed',
        });
    });

    it('should create redirectToIam action', () => {
        const iamUrl = 'https://iam.example.org/login';

        const action = authActions.redirectToIam({ iamUrl });

        expect(action).toEqual({
            type: '[MP Auth] redirectToIam',
            iamUrl,
        });
    });

    it('should create invalidOAuthFlowHash action', () => {
        const action = authActions.invalidOAuthFlowHash();

        expect(action).toEqual({
            type: '[MP Auth] invalidOAuthFlowHash',
        });
    });

    it('should create createSession action', () => {
        const idToken = 'id-token';

        const action = authActions.createSession({ idToken });

        expect(action).toEqual({
            type: '[MP Auth] createSession',
            idToken,
        });
    });

    it('should create createSessionFailed action', () => {
        const action = authActions.createSessionFailed();

        expect(action).toEqual({
            type: '[MP Auth] createSessionFailed',
        });
    });

    it('should create sessionCreated action', () => {
        const action = authActions.sessionCreated({ user });

        expect(action).toEqual({
            type: '[MP Auth] sessionCreated',
            user,
        });
    });

    it('should create validateSession action', () => {
        const action = authActions.validateSession();

        expect(action).toEqual({
            type: '[MP Auth] validateSession',
        });
    });

    it('should create sessionValidated action', () => {
        const action = authActions.sessionValidated({ user });

        expect(action).toEqual({
            type: '[MP Auth] sessionValidated',
            user,
        });
    });

    it('should create sessionValidationFailed action with expired reason', () => {
        const action = authActions.sessionValidationFailed({
            reason: 'expired',
        });

        expect(action).toEqual({
            type: '[MP Auth] sessionValidationFailed',
            reason: 'expired',
        });
    });

    it('should create sessionValidationFailed action with missing reason', () => {
        const action = authActions.sessionValidationFailed({
            reason: 'missing',
        });

        expect(action).toEqual({
            type: '[MP Auth] sessionValidationFailed',
            reason: 'missing',
        });
    });

    it('should create userAugmented action', () => {
        const action = authActions.userAugmented({ user });

        expect(action).toEqual({
            type: '[MP Auth] userAugmented',
            user,
        });
    });

    it('should create signedUp action', () => {
        const action = authActions.signedUp();

        expect(action).toEqual({
            type: '[MP Auth] signedUp',
        });
    });

    it('should create logOut action', () => {
        const action = authActions.logOut();

        expect(action).toEqual({
            type: '[MP Auth] logOut',
        });
    });

    it('should create loggedOut action', () => {
        const action = authActions.loggedOut();

        expect(action).toEqual({
            type: '[MP Auth] loggedOut',
        });
    });
});
