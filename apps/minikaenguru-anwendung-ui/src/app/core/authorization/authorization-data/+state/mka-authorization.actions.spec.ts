import { User } from '@matheportal/auth-model';
import { MkaAuthorizationActions } from './mka-authorization.actions';

describe('mka-authorization.actions', () => {
    it('should create the ensureMkaAuthorizationLoaded action', () => {
        const action = MkaAuthorizationActions.ensureMkaAuthorizationLoaded();

        expect(action).toEqual({
            type: '[MKA Authorization] ensureMkaAuthorizationLoaded',
        });
    });

    it('should create the loadMkaAuthorization action', () => {
        const action = MkaAuthorizationActions.loadMkaAuthorization();

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

        const action = MkaAuthorizationActions.mkaAuthorizationLoaded({ user });

        expect(action).toEqual({
            type: '[MKA Authorization] mkaAuthorizationLoaded',
            user,
        });
    });

    it('should create the loadMkaAuthorizationFailed action', () => {
        const action = MkaAuthorizationActions.loadMkaAuthorizationFailed();

        expect(action).toEqual({
            type: '[MKA Authorization] loadMkaAuthorizationFailed',
        });
    });
});
