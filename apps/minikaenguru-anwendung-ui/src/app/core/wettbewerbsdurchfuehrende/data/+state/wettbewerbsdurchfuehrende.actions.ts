import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    WettbewerbsdurchfuehrenderDto,
    WettbewerbsdurchfuerenderRequest,
} from '../../model/wettbewerbsdurchfuehrende.model';

export const wettbewerbsdurchfuehrendeActions = createActionGroup({
    source: 'wettbewerbsdurchfuehrendeActions',
    events: {
        durchfuehrendenAnlegen: props<{ requestDto: WettbewerbsdurchfuerenderRequest }>(),
        durchfuehrenderAngelegt: props<{ responseDto: WettbewerbsdurchfuehrenderDto }>(),
        durchfuehrendenAnlegenFailed: emptyProps(),
    },
});
