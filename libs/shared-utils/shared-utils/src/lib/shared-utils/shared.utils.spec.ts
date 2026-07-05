import { assertDefined } from './shared.utils';

describe('shared model tests', () => {
    describe('assertDefined', () => {
        it('should return the value if defined', () => {
            const result = assertDefined({ foo: 'hallo' }, 'ich hätte jetzt defined erwartet');
            expect(result).toEqual({ foo: 'hallo' });
        });
        it('throws an Error when undefined', () => {
            expect(() => assertDefined(undefined, 'ich hätte jetzt defined erwartet')).toThrow(
                'ich hätte jetzt defined erwartet'
            );
        });
    });
});
