import { Action } from '@ngrx/store';
import { wettbewerbsdurchfuehrendeFeature } from './wettbewerbsdurchfuehrende.reducer';
import {
    DURCHFUEHRUNGSART,
    initialWettbewerbsdurchfuehrender,
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderDto,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { userLoggedOut } from '@matheportal/auth-api';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';

describe('wettbewerbsdurchfuehrendeFeature tests', () => {
    const unknownAction = { type: 'unknownAction' } as Action;

    const knownDurchfuehrender: Wettbewerbsdurchfuehrender = {
        newsletter: true,
        teilnahmenummern: ['A1234567'],
        zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.erteilt,
        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
    };

    describe('sanity checks', () => {
        it('should return the initial state, when unknown action and undefined state', () => {
            const state = wettbewerbsdurchfuehrendeFeature.reducer(undefined, unknownAction);
            expect(state.wettbewerbsdurchfuehrender).not.toBeDefined();
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                { wettbewerbsdurchfuehrender: knownDurchfuehrender },
                unknownAction
            );
            expect(state.wettbewerbsdurchfuehrender).toEqual(knownDurchfuehrender);
        });
    });

    describe('wettbewerbsdurchfuehrenderAngelegt', () => {
        it('should map the responseDto', () => {
            const responseDto: WettbewerbsdurchfuehrenderDto = {
                durchfuehrungsart: 'SCHULE',
                newsletter: true,
                teilnahmenummern: ['Z98765432', 'A1234567'],
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                { wettbewerbsdurchfuehrender: initialWettbewerbsdurchfuehrender },
                wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto })
            );

            expect(state.wettbewerbsdurchfuehrender?.durchfuehrungsart).toBe(DURCHFUEHRUNGSART.schule);
            expect(state.wettbewerbsdurchfuehrender?.newsletter).toBeTruthy();
            expect(state.wettbewerbsdurchfuehrender?.teilnahmenummern).toEqual(['Z98765432', 'A1234567']);
            expect(state.wettbewerbsdurchfuehrender?.zugangsberechtigungUnterlagen).toBe(
                ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard
            );
        });
    });

    describe('userLoggedOut', () => {
        it('should return the initial state when user logged out', () => {
            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                { wettbewerbsdurchfuehrender: knownDurchfuehrender },
                userLoggedOut
            );

            expect(state.wettbewerbsdurchfuehrender).not.toBeDefined();
        });
    });
});
