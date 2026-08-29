/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard-scss'],

    rules: {
        // Theme-Konventionen
        'color-no-hex': true,
        'color-named': 'never',
        'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color'],

        // Projektkonventionen
        'selector-class-pattern': [
            '^[a-z][a-z0-9-]*(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?$',
            {
                message: 'Expected BEM class selector',
            },
        ],

        'scss/at-mixin-argumentless-call-parentheses': 'always',

        // übernimmt Prettier
        'at-rule-empty-line-before': null,
        'declaration-empty-line-before': null,
        'rule-empty-line-before': null,

        // leere Component-SCSS-Dateien sind erlaubt
        'no-empty-source': null,

        // nicht die eigenen mixins
        'scss/at-mixin-argumentless-call-parentheses': 'never',
    },

    overrides: [
        {
            files: ['libs/shared-ui-theme/**/*.scss'],
            rules: {
                'color-no-hex': null,
                'color-named': null,
                'function-disallowed-list': null,
            },
        },
    ],
};
