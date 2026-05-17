import { SESSION_VALIDATION_FAILED_REASON, User } from '@matheportal/auth-model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const authActions = createActionGroup({
    source: 'Auth',
    events: {
        requestLoginUrl: emptyProps(),
        requestLoginUrlFailed: emptyProps(),
        redirectToIam: props<{ iamUrl: string }>(),
        validateSession: emptyProps(),
        sessionValidated: props<{ user: User }>(),
        sessionValidationFailed: props<{ reason: SESSION_VALIDATION_FAILED_REASON }>(),
        logOut: emptyProps(),
        loggedOut: props<{ reason: SESSION_VALIDATION_FAILED_REASON }>(),
    },
});
