import { LOGGED_OUT_REASON } from '@matheportal/auth-model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const authActions = createActionGroup({
    source: 'Auth',
    events: {
        bootstrapAuth: emptyProps(),
        logIn: emptyProps(),
        requestLoginUrl: emptyProps(),
        reloadSession: emptyProps(),
        sessionLoaded: emptyProps(),
        reloadSesssionFailed: props<{ reason: LOGGED_OUT_REASON }>(),
        logOut: emptyProps(),
        loggedOut: props<{ reason: LOGGED_OUT_REASON }>(),
    },
});
