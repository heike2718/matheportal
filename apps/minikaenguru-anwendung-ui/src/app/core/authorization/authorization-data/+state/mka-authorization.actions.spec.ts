import { User } from '@matheportal/auth-model';
import { mkaAuthorizationActions } from './mka-authorization.actions';

describe('mka-authorization.actions', () => {
    it('should create the loadMkaAuthorization action', () => {
        const action = mkaAuthorizationActions.loadMkaAuthorization();

        expect(action).toEqual({
            type: '[MKA Authorization] loadMkaAuthorization',
        });
    });

    it('should create the mkaAuthorizationLoaded action', () => {
        const user: User = {
            anonym: false,
            berechtigungen: ['STANDARD', 'SCHULE'],
            fullName: 'Levi Lehrer',
        };

        const action = mkaAuthorizationActions.mkaAuthorizationLoaded({ user });

        expect(action).toEqual({
            type: '[MKA Authorization] mkaAuthorizationLoaded',
            user,
        });
    });

    it('should create the loadMkaAuthorizationFailed action', () => {
        const action = mkaAuthorizationActions.loadMkaAuthorizationFailed();

        expect(action).toEqual({
            type: '[MKA Authorization] loadMkaAuthorizationFailed',
        });
    });
});
