import { RaetselbaukastenEinstiegActions } from './raetselbaukasten-einstieg.actions';

describe('RaetselbaukastenEinstiegActions', () => {
    it('should create the rootEinstiegRequested action', () => {
        const action = RaetselbaukastenEinstiegActions.rootEinstiegRequested();
        expect(action).toEqual({
            type: '[RBK Einstieg] rootEinstiegRequested',
        });
    });
});
