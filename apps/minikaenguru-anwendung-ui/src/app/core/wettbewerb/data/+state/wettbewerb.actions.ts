import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Wettbewerb } from '../../model/wettbewerb.model';

export const wettbewerbActions = createActionGroup({
    source: 'MKA Wettbewerb',
    events: {
        wettbewerbLaden: emptyProps(),
        wettbewerbGeladen: props<{ wettbewerb: Wettbewerb }>(),
        wettbewerbLadenFailed: props<{ error: Error }>(),
    },
});
