import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    WettbewerbsdurchfuehrenderDto,
    WettbewerbsdurchfuehrenderRequest,
} from '../../model/wettbewerbsdurchfuehrende.model';

export const wettbewerbsdurchfuehrendeActions = createActionGroup({
    source: 'MKA Wettbewerbsdurchfuerende API',
    events: {
        durchfuehrungsartSchuleGewaehlt: emptyProps(),
        durchfuehrungsartPrivatGewaehlt: emptyProps(),
        durchfuehrendenAnlegen: props<{ requestDto: WettbewerbsdurchfuehrenderRequest }>(),
        durchfuehrenderAngelegt: props<{ responseDto: WettbewerbsdurchfuehrenderDto }>(),
        durchfuehrendenAnlegenFailed: props<{ error: Error }>(),
    },
});
