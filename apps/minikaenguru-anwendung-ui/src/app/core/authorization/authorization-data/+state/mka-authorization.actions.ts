import { User } from '@matheportal/auth-model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const MkaAuthorizationActions = createActionGroup({
    source: 'MKA Authorization',
    events: {
        ensureMkaAuthorizationLoaded: emptyProps(),
        loadMkaAuthorization: emptyProps(),
        mkaAuthorizationLoaded: props<{ user: User }>(),
        loadMkaAuthorizationFailed: emptyProps(),
    },
});
