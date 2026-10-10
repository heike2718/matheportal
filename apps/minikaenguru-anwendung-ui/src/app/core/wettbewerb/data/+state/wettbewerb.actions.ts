import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Wettbewerb } from '../../model/wettbewerb.model';

export const WettbewerbActions = createActionGroup({
    source: 'MKA Wettbewerb',
    events: {
        ensureWettbewerbGeladen: emptyProps(),
        wettbewerbLaden: emptyProps(),
        wettbewerbGeladen: props<{ wettbewerb: Wettbewerb }>(),
        wettbewerbLadenFailed: props<{ error: Error }>(),
    },
});
