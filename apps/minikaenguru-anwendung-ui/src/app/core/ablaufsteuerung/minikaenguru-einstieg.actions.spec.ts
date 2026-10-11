import { DURCHFUEHRUNGSART } from '../wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { MinikaenguruEinstiegActions } from './minikaenguru-einstieg.actions';

describe('MinikaenguruEinstiegActions', () => {
    it('should create the kontextLadenOnWettbewerbsorganisationGestartet action', () => {
        const action = MinikaenguruEinstiegActions.kontextLadenOnWettbewerbsorganisationGestartet({
            durchfuehrungsart: DURCHFUEHRUNGSART.schule,
            kontextkuerzel: 'S1234567',
        });
        expect(action).toEqual({
            type: '[MKA Einstieg] kontextLadenOnWettbewerbsorganisationGestartet',
            durchfuehrungsart: DURCHFUEHRUNGSART.schule,
            kontextkuerzel: 'S1234567',
        });
    });
});
