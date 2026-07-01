import { User } from '@matheportal/auth-model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const mkaAuthorizationActions = createActionGroup({
    source: 'MkaAuthorization',
    events: {
        loadMkaAuthorization: emptyProps(),
        mkaAuthorizationLoaded: props<{ user: User }>(),
        loadMkaAuthorizationFailed: emptyProps(),
    },
});
