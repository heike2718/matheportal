import { resolveMessageDismissAfterMs } from './feedback.model';

describe('resolveMessageDismissAfterMs', () => {
    it('should return the minimum duration for short messages', () => {
        expect(resolveMessageDismissAfterMs('Kurz')).toBe(3000);
    });

    it('should calculate the duration based on normalized message length', () => {
        const message = 'a'.repeat(100);

        expect(resolveMessageDismissAfterMs(message)).toBe(4500);
    });

    it('should return the maximum duration for very long messages', () => {
        const message = 'a'.repeat(1000);

        expect(resolveMessageDismissAfterMs(message)).toBe(7000);
    });

    it('should normalize whitespace before calculating the duration', () => {
        const message = 'abc     def\n\nxyz';

        expect(resolveMessageDismissAfterMs(message)).toBe(3000);
    });
});
