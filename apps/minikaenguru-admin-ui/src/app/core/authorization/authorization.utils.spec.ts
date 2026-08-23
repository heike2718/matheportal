import { isAdmin } from './authorization.utils';

describe('authorization.utils', () => {
    describe('function isAdmin tests', () => {
        it('should isAdmin return false when empty', () => {
            expect(isAdmin([])).toBe(false);
        });
        it('should isAdmin return false when not admin', () => {
            expect(isAdmin(['STANDARD', 'KL_ADMIN', 'SCHULE'])).toBe(false);
        });
        it('should isAdmin return true when admin', () => {
            expect(isAdmin(['ADMIN', 'KL_ADMIN'])).toBe(true);
        });
    });
});
