import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderRequest,
} from '../../model/wettbewerbsdurchfuehrende.model';

export const WettbewerbsdurchfuehrendeActions = createActionGroup({
    source: 'MKA Wettbewerbsdurchfuehrende',
    events: {
        durchfuehrungsartSchuleGewaehlt: emptyProps(),
        durchfuehrungsartPrivatGewaehlt: emptyProps(),
        durchfuehrendenAnlegen: props<{ requestDto: WettbewerbsdurchfuehrenderRequest }>(),
        durchfuehrenderAngelegt: props<{ wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender }>(),
        durchfuehrendenAnlegenFailed: props<{ error: Error }>(),
        durchfuehrendenLaden: emptyProps(),
        durchfuehrenderGeladen: props<{ wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender }>(),
        durchfuehrendenLadenFailed: props<{ error: Error }>(),
    },
});
