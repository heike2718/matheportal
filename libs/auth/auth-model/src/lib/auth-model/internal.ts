import { AUTH_RESULT_STATE } from './auth.model';

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
