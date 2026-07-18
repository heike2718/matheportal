import { User } from '@matheportal/auth-model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SESSION_VALIDATION_FAILED_REASON } from '../auth-data.utils';

export const authActions = createActionGroup({
    source: 'Auth',
    events: {
        requestLoginUrl: emptyProps(),
        requestLoginUrlFailed: emptyProps(),
        requestSignupUrl: emptyProps(),
        requestSignupUrlFailed: emptyProps(),
        redirectToIam: props<{ iamUrl: string }>(),
        invalidOAuthFlowHash: emptyProps(),
        createSession: props<{ idToken: string }>(),
        createSessionFailed: emptyProps(),
        sessionCreated: props<{ user: User }>(),
        validateSession: emptyProps(),
        sessionValidated: props<{ user: User }>(),
        sessionValidationFailed: props<{ reason: SESSION_VALIDATION_FAILED_REASON }>(),
        userAugmented: props<{ user: User }>(),
        signedUp: emptyProps(),
        logOut: emptyProps(),
        loggedOut: emptyProps(),
    },
});
