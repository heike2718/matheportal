import { createActionGroup, props } from '@ngrx/store';
import { Durchfuehrungsart } from '../wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';

export const MinikaenguruEinstiegActions = createActionGroup({
    source: 'MKA Einstieg',
    events: {
        kontextLadenOnWettbewerbsorganisationGestartet: props<{
            durchfuehrungsart: Durchfuehrungsart;
            kontextkuerzel: string;
        }>(),
    },
});
