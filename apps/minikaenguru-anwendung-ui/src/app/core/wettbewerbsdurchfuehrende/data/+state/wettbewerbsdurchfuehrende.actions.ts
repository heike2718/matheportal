import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    WettbewerbsdurchfuehrenderDto,
    WettbewerbsdurchfuerenderRequest,
} from '../../model/wettbewerbsdurchfuehrende.model';

export const wettbewerbsdurchfuehrendeActions = createActionGroup({
    source: 'MKA Wettbewerbsdurchfuerende API',
    events: {
        durchfuehrungsartSchuleGewaehlt: emptyProps(),
        durchfuehrungsartPrivatGewaehlt: emptyProps(),
        durchfuehrendenAnlegen: props<{ requestDto: WettbewerbsdurchfuerenderRequest }>(),
        durchfuehrenderAngelegt: props<{ responseDto: WettbewerbsdurchfuehrenderDto }>(),
        durchfuehrendenAnlegenFailed: props<{ error: Error }>(),
    },
});
