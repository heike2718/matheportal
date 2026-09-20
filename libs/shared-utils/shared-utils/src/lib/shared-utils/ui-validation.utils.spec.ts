import { FormControl } from '@angular/forms';
import { notBlankValidator } from './ui-validation.utils';

describe('notBlankValidator', () => {
    it.each(['', ' ', '   '])('should return notBlank error for "%s"', value => {
        const control = new FormControl(value);

        expect(notBlankValidator(control)).toEqual({ notBlank: true });
    });

    it.each(['Schule', ' Grundschule ', 'Grundschule  am Park'])('should return null for "%s"', value => {
        const control = new FormControl(value);

        expect(notBlankValidator(control)).toBeNull();
    });
});
