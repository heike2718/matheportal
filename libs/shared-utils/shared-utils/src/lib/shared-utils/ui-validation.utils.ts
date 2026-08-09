export const MINIKAENGURU_TEXT_PATTERN = /^[\p{sc=Latin}\p{M}\p{N}\p{P}\p{S}\p{Zs}]*$/u;

export const MINIKAENGURU_TEXT_UNSUPPORTED_CHARACTERS_PATTERN = /[^\p{sc=Latin}\p{M}\p{N}\p{P}\p{S}\p{Zs}]/gu;

export const MINIKAENGURU_TEXT_VALIDATION_HINT =
    'Erlaubt sind lateinische Buchstaben, Zahlen, Leerzeichen, Satzzeichen und Symbole.';
