import { Action } from '@ngrx/store';
import { mkaAuthorizationFeature, MkaAuthorizationState } from './mka-authorization.reducer';
import { User } from '@matheportal/auth-model';
import { mkaAuthorizationActions } from './mka-authorization.actions';
import { MINIKAENGURU_BERECHTIGUNGSTYP } from '../../authorization-model';
import { userLoggedOut } from '@matheportal/auth-api';

describe('mkaAuthorizationFeature tests', () => {
    const unknownAction = { type: 'unknownAction' } as Action;

    describe('mkaAuthorizationFeature sanity checks', () => {
        it('should return the initial state, when unknown action and undefined state', () => {
            const state = mkaAuthorizationFeature.reducer(undefined, unknownAction);
            expect(state.authorizationLoadState).toEqual('not-loaded');
            expect(state.berechtigungstyp).toEqual(MINIKAENGURU_BERECHTIGUNGSTYP.none);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const state = mkaAuthorizationFeature.reducer(
                { authorizationLoadState: 'loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.schule },
                unknownAction
            );
            expect(state.authorizationLoadState).toEqual('loaded');
            expect(state.berechtigungstyp).toEqual(MINIKAENGURU_BERECHTIGUNGSTYP.schule);
        });
    });

    describe('mkaAuthorizationLoaded tests', () => {
        it('should return loaded and schule, when initial state and loaded with berechtigung SCHULE', () => {
            const actualState: MkaAuthorizationState = {
                authorizationLoadState: 'not-loaded',
                berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none,
            };
            const user: User = {
                anonym: false,
                fullName: 'Jonny Lehrer',
                berechtigungen: [MINIKAENGURU_BERECHTIGUNGSTYP.schule],
            };
            const state = mkaAuthorizationFeature.reducer(
                actualState,
                mkaAuthorizationActions.mkaAuthorizationLoaded({ user })
            );
            expect(state.authorizationLoadState).toEqual('loaded');
            expect(state.berechtigungstyp).toEqual(MINIKAENGURU_BERECHTIGUNGSTYP.schule);
        });
        it('should return loaded and privat, when initial state and loaded with berechtigung PRIVAT', () => {
            const actualState: MkaAuthorizationState = {
                authorizationLoadState: 'not-loaded',
                berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none,
            };
            const user: User = {
                anonym: false,
                fullName: 'James Privat',
                berechtigungen: [MINIKAENGURU_BERECHTIGUNGSTYP.privat],
            };
            const state = mkaAuthorizationFeature.reducer(
                actualState,
                mkaAuthorizationActions.mkaAuthorizationLoaded({ user })
            );
            expect(state.authorizationLoadState).toEqual('loaded');
            expect(state.berechtigungstyp).toEqual(MINIKAENGURU_BERECHTIGUNGSTYP.privat);
        });
        it('should return loaded and none, when initial state and loaded without MK-Berechtigungen', () => {
            const actualState: MkaAuthorizationState = {
                authorizationLoadState: 'not-loaded',
                berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none,
            };
            const user: User = {
                anonym: false,
                fullName: 'Stanislaw Standard',
                berechtigungen: ['STANDARD'],
            };
            const state = mkaAuthorizationFeature.reducer(
                actualState,
                mkaAuthorizationActions.mkaAuthorizationLoaded({ user })
            );
            expect(state.authorizationLoadState).toEqual('loaded');
            expect(state.berechtigungstyp).toEqual(MINIKAENGURU_BERECHTIGUNGSTYP.none);
        });
    });

    describe('all loadMkaAuthorizationFailed tests', () => {
        it.each([
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none }],
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.schule }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.schule }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.schule }],
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.privat }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.privat }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.privat }],
        ] as [MkaAuthorizationState][])(
            'should return failed when authorizationLoadState is $authorizationLoadState and veranstalterTyp is $veranstalterTyp',
            (actualState: MkaAuthorizationState) => {
                const state = mkaAuthorizationFeature.reducer(
                    actualState,
                    mkaAuthorizationActions.loadMkaAuthorizationFailed()
                );

                expect(state.authorizationLoadState).toEqual('failed');
                expect(state.berechtigungstyp).toEqual(actualState.berechtigungstyp);
            }
        );
    });

    describe('all userLoggedOut tests', () => {
        it.each([
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none }],
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.schule }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.schule }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.schule }],
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.privat }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.privat }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.privat }],
        ] as [MkaAuthorizationState][])(
            'should return initialState when userLoggedOut and authorizationState is $authorizationLoadState and veranstalterTyp is $veranstalterTyp',
            (actualState: MkaAuthorizationState) => {
                const state = mkaAuthorizationFeature.reducer(actualState, userLoggedOut);

                expect(state.authorizationLoadState).toEqual('not-loaded');
                expect(state.berechtigungstyp).toEqual(MINIKAENGURU_BERECHTIGUNGSTYP.none);
            }
        );
    });
});
