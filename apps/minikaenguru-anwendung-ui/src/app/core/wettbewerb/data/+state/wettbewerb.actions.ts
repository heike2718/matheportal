import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Wettbewerb } from '../../model/wettbewerb.model';

export const wettbewerbActions = createActionGroup({
    source: 'MKA Wettbewerb',
    events: {
        loadWettbewerb: emptyProps(),
        wettbewerbLoaded: props<{ wettbewerb: Wettbewerb }>(),
        loadWettbewerbFailed: props<{ error: Error }>(),
    },
});
