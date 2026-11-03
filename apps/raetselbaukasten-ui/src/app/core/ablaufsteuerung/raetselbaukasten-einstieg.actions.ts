import { createActionGroup, emptyProps } from '@ngrx/store';

export const RaetselbaukastenEinstiegActions = createActionGroup({
    source: 'RBK Einstieg',
    events: {
        rootEinstiegRequested: emptyProps(),
    },
});
