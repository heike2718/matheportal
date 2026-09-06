import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderRequest,
} from '../../model/wettbewerbsdurchfuehrende.model';

export const wettbewerbsdurchfuehrendeActions = createActionGroup({
    source: 'MKA Wettbewerbsdurchfuerende API',
    events: {
        durchfuehrungsartSchuleGewaehlt: emptyProps(),
        durchfuehrungsartPrivatGewaehlt: emptyProps(),
        durchfuehrendenAnlegen: props<{ requestDto: WettbewerbsdurchfuehrenderRequest }>(),
        durchfuehrenderAngelegt: props<{ responseDto: Wettbewerbsdurchfuehrender }>(),
        durchfuehrendenAnlegenFailed: props<{ error: Error }>(),
    },
});
