import { Schule } from '../../../core/model/schulkatalog.model';
import { SchulenState } from './schule.reducer';
import { selectWettbewerbskontextLoaded, selectWettbewerbskontextLoadState } from './schule.selectors';

describe('schulenSelectors', () => {
    const state: SchulenState = {
        wettbewerbskontext: undefined,
        wettbewerbskontextLoadState: 'loaded',
        schulkollegiumLoadState: 'not-loaded',
    };

    it('should expose selectWettbewerbskontextLoadState', () => {
        const result = selectWettbewerbskontextLoadState.projector(state);
        expect(result).toEqual('loaded');
    });

    it('should expose selectWettbewerbskontextLoaded return true when loaded', () => {
        const result = selectWettbewerbskontextLoaded.projector(state.wettbewerbskontextLoadState);
        expect(result).toEqual(true);
    });
});
