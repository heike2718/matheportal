import {
    DURCHFUEHRUNGSART,
    Durchfuehrungsart,
    mapDto,
    WettbewerbsdurchfuehrenderDto,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
    ZugangsberechtigungUnterlagen,
} from './wettbewerbsdurchfuehrende.model';

interface TestParameters {
    readonly durchfuehrungsart: string;
    readonly zugangsberechtigungUnterlagen: string;
    readonly expectedDurchfuehrungsart: Durchfuehrungsart;
    readonly expectedZugangsberechtigung: ZugangsberechtigungUnterlagen;
}

describe('mapDto tests', () => {
    it.each([
        [
            {
                durchfuehrungsart: 'SCHULE',
                zugangsberechtigungUnterlagen: 'STANDARD',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.schule,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
            },
        ],
        [
            {
                durchfuehrungsart: 'PRIVAT',
                zugangsberechtigungUnterlagen: 'STANDARD',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.privat,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
            },
        ],
        [
            {
                durchfuehrungsart: 'SCHULE',
                zugangsberechtigungUnterlagen: 'ERTEILT',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.schule,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.erteilt,
            },
        ],
        [
            {
                durchfuehrungsart: 'PRIVAT',
                zugangsberechtigungUnterlagen: 'ERTEILT',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.privat,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.erteilt,
            },
        ],
        [
            {
                durchfuehrungsart: 'SCHULE',
                zugangsberechtigungUnterlagen: 'ENTZOGEN',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.schule,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.entzogen,
            },
        ],
        [
            {
                durchfuehrungsart: 'PRIVAT',
                zugangsberechtigungUnterlagen: 'ENTZOGEN',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.privat,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.entzogen,
            },
        ],
    ] as [TestParameters][])(
        'should map the dto when newsletter true and teilnahmenummern not empty $durchfuehrungsart and $zugangsberechtigungUnterlagen',
        testParameter => {
            const dto: WettbewerbsdurchfuehrenderDto = {
                durchfuehrungsart: testParameter.durchfuehrungsart,
                newsletter: true,
                teilnahmenummern: ['A1234567', 'Z987654321'],
                zugangsberechtigungUnterlagen: testParameter.zugangsberechtigungUnterlagen,
            };

            const result = mapDto(dto);
            expect(result.newsletter).toBeTruthy();
            expect(result.teilnahmenummern).toEqual(['A1234567', 'Z987654321']);
            expect(result.durchfuehrungsart).toBe(testParameter.expectedDurchfuehrungsart);
            expect(result.zugangsberechtigungUnterlagen).toBe(testParameter.expectedZugangsberechtigung);
        }
    );

    it.each([
        [
            {
                durchfuehrungsart: 'SCHULE',
                zugangsberechtigungUnterlagen: 'STANDARD',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.schule,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
            },
        ],
        [
            {
                durchfuehrungsart: 'PRIVAT',
                zugangsberechtigungUnterlagen: 'STANDARD',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.privat,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
            },
        ],
        [
            {
                durchfuehrungsart: 'SCHULE',
                zugangsberechtigungUnterlagen: 'ERTEILT',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.schule,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.erteilt,
            },
        ],
        [
            {
                durchfuehrungsart: 'PRIVAT',
                zugangsberechtigungUnterlagen: 'ERTEILT',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.privat,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.erteilt,
            },
        ],
        [
            {
                durchfuehrungsart: 'SCHULE',
                zugangsberechtigungUnterlagen: 'ENTZOGEN',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.schule,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.entzogen,
            },
        ],
        [
            {
                durchfuehrungsart: 'PRIVAT',
                zugangsberechtigungUnterlagen: 'ENTZOGEN',
                expectedDurchfuehrungsart: DURCHFUEHRUNGSART.privat,
                expectedZugangsberechtigung: ZUGANGSBERECHTIGUNG_UNTERLAGEN.entzogen,
            },
        ],
    ] as [TestParameters][])(
        'should map the dto when newsletter false and teilnahmenummern empty $durchfuehrungsart and $zugangsberechtigungUnterlagen',
        testParameter => {
            const dto: WettbewerbsdurchfuehrenderDto = {
                durchfuehrungsart: testParameter.durchfuehrungsart,
                newsletter: false,
                teilnahmenummern: [],
                zugangsberechtigungUnterlagen: testParameter.zugangsberechtigungUnterlagen,
            };

            const result = mapDto(dto);
            expect(result.newsletter).toBeFalsy();
            expect(result.teilnahmenummern.length).toBe(0);
            expect(result.durchfuehrungsart).toBe(testParameter.expectedDurchfuehrungsart);
            expect(result.zugangsberechtigungUnterlagen).toBe(testParameter.expectedZugangsberechtigung);
        }
    );

    it('map Durchfuehrungsart is case sensitive', () => {
        const dto: WettbewerbsdurchfuehrenderDto = {
            durchfuehrungsart: 'schule',
            newsletter: false,
            teilnahmenummern: [],
            zugangsberechtigungUnterlagen: 'ERTEILT',
        };

        expect(() => mapDto(dto)).toThrow(
            Error('unerwarteter Wert schule - kann nicht auf Durchfuehrungsart gemapped werden')
        );
    });

    it('should throw an Error when durchfuehrungsart is not known', () => {
        const dto: WettbewerbsdurchfuehrenderDto = {
            durchfuehrungsart: 'hoi',
            newsletter: false,
            teilnahmenummern: [],
            zugangsberechtigungUnterlagen: 'ERTEILT',
        };

        expect(() => mapDto(dto)).toThrow(
            Error('unerwarteter Wert hoi - kann nicht auf Durchfuehrungsart gemapped werden')
        );
    });

    it('map ZugangsberechtigungUnterlagen is case sensitive', () => {
        const dto: WettbewerbsdurchfuehrenderDto = {
            durchfuehrungsart: 'PRIVAT',
            newsletter: false,
            teilnahmenummern: [],
            zugangsberechtigungUnterlagen: 'erteilt',
        };

        expect(() => mapDto(dto)).toThrow(
            Error('unerwarteter Wert erteilt - kann nicht auf ZugangsberechtigungUnterlagen gemapped werden')
        );
    });

    it('should throw an Error when zugangsberechtigung is not known', () => {
        const dto: WettbewerbsdurchfuehrenderDto = {
            durchfuehrungsart: 'SCHULE',
            newsletter: false,
            teilnahmenummern: [],
            zugangsberechtigungUnterlagen: 'hoi',
        };

        const durchfuehrungsart: Durchfuehrungsart = DURCHFUEHRUNGSART.privat;
        expect(durchfuehrungsart as string).toBe('PRIVAT');

        expect(() => mapDto(dto)).toThrow(
            Error('unerwarteter Wert hoi - kann nicht auf ZugangsberechtigungUnterlagen gemapped werden')
        );
    });
});
