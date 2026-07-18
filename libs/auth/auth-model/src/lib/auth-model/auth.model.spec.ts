import { anonymousUser, User } from './auth.model';

describe('auth-model', () => {
    describe('anonymousUser', () => {
        it('anonymousUser is as expected', () => {
            const gast: User = anonymousUser;
            expect(gast.anonym).toBeTruthy();
            expect(gast.berechtigungen.length).toBe(0);
            expect(gast.fullName).toBe('Gast');
        });
    });
});
