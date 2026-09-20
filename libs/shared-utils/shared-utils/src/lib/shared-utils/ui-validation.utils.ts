import { ValidatorFn } from '@angular/forms';

export const MINIKAENGURU_TEXT_PATTERN = /^[\p{sc=Latin}\p{M}\p{N}\p{P}\p{S}\p{Zs}]*$/u;

export const MINIKAENGURU_TEXT_UNSUPPORTED_CHARACTERS_PATTERN = /[^\p{sc=Latin}\p{M}\p{N}\p{P}\p{S}\p{Zs}]/gu;

export const MINIKAENGURU_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MINIKAENGURU_TEXT_VALIDATION_HINT =
    'Erlaubt sind lateinische Buchstaben, Zahlen, Leerzeichen, Satzzeichen und Symbole.';

export const notBlankValidator: ValidatorFn = control => {
    const value = control.value;

    if (typeof value !== 'string') {
        return null;
    }

    return value.trim().length > 0 ? null : { notBlank: true };
};
