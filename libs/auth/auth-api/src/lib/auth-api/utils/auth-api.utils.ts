import { AUTH_RESULT_STATE, AuthResult } from '@matheportal/auth-model';

export function mapToAuthResultState(value: string | null): AUTH_RESULT_STATE {
    if (value === null) {
        return 'invalid';
    }
    switch (value) {
        case 'login':
            return 'login';
        case 'signup':
            return 'signup';
        default:
            return 'invalid';
    }
}

export function getIdToken(idTokenParam: string | null | undefined): string | undefined {
    if (!idTokenParam) {
        return undefined;
    }

    return idTokenParam.trim().length === 0 ? undefined : idTokenParam.trim();
}

export function mapHashToAuthResult(hash: string): AuthResult | null {
    const cleanedHash = hash.replace(/^#?\/?/, '');

    if (cleanedHash.length === 0) {
        return null;
    }

    const params = new URLSearchParams(cleanedHash);

    if (!params.get('oauthFlowType')) {
        return null;
    }

    const authState = mapToAuthResultState(params.get('state'));
    const idToken = getIdToken(params.get('idToken'));

    if (authState === 'signup') {
        return {
            state: 'signup',
            idToken,
        };
    }

    if (authState === 'login') {
        return {
            state: 'login',
            idToken,
        };
    }

    return {
        state: 'invalid',
        idToken,
    };
}
