import { Schule } from '../../../core/model/schulkatalog.model';
import { schulenActions } from './schulen.actions';

describe('schulenActions', () => {
    it('should create the schulenLaden action', () => {
        const action = schulenActions.schulenLaden();

        expect(action).toEqual({
            type: '[MKA Schulen] schulenLaden',
        });
    });

    it('should create the schulenGeladen action', () => {
        const schulen: Schule[] = [];
        const action = schulenActions.schulenGeladen({ schulen });

        expect(action).toEqual({
            type: '[MKA Schulen] schulenGeladen',
            schulen,
        });
    });

    it('should create the schulenLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = schulenActions.schulenLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schulen] schulenLadenFailed',
            error,
        });
    });
});
