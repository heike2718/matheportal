import { Action } from '@ngrx/store';
import { mkaAuthorizationFeature, MkaAuthorizationState } from './mka-authorization.reducer';
import { User } from '@matheportal/auth-model';
import { mkaAuthorizationActions } from './mka-authorization.actions';
import { AuthorizationLoadState } from '../../authorization-model';

describe('mkaAuthorizationFeature tests', () => {
    const unknownAction = { type: 'unknownAction' } as Action;

    describe('mkaAuthorizationFeature sanity checks', () => {
        it('should return the initial state, when unknown action and undefined state', () => {
            const state = mkaAuthorizationFeature.reducer(undefined, unknownAction);
            expect(state.authorizationLoadState).toEqual('not-loaded');
            expect(state.berechtigungstyp).toEqual('NONE');
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const state = mkaAuthorizationFeature.reducer(
                { authorizationLoadState: 'loaded', berechtigungstyp: 'SCHULE' },
                unknownAction
            );
            expect(state.authorizationLoadState).toEqual('loaded');
            expect(state.berechtigungstyp).toEqual('SCHULE');
        });
    });

    describe('mkaAuthorizationLoaded tests', () => {
        it('should return loaded and schule, when initial state and loaded with berechtigung SCHULE', () => {
            const actualState: MkaAuthorizationState = {
                authorizationLoadState: 'not-loaded',
                berechtigungstyp: 'NONE',
            };
            const user: User = {
                anonym: false,
                fullName: 'Jonny Lehrer',
                berechtigungen: ['SCHULE'],
            };
            const state = mkaAuthorizationFeature.reducer(
                actualState,
                mkaAuthorizationActions.mkaAuthorizationLoaded({ user })
            );
            expect(state.authorizationLoadState).toEqual('loaded');
            expect(state.berechtigungstyp).toEqual('SCHULE');
        });
        it('should return loaded and privat, when initial state and loaded with berechtigung PRIVAT', () => {
            const actualState: MkaAuthorizationState = {
                authorizationLoadState: 'not-loaded',
                berechtigungstyp: 'NONE',
            };
            const user: User = {
                anonym: false,
                fullName: 'James Privat',
                berechtigungen: ['PRIVAT'],
            };
            const state = mkaAuthorizationFeature.reducer(
                actualState,
                mkaAuthorizationActions.mkaAuthorizationLoaded({ user })
            );
            expect(state.authorizationLoadState).toEqual('loaded');
            expect(state.berechtigungstyp).toEqual('PRIVAT');
        });
        it('should return loaded and none, when initial state and loaded without MK-Berechtigungen', () => {
            const actualState: MkaAuthorizationState = {
                authorizationLoadState: 'not-loaded',
                berechtigungstyp: 'NONE',
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
            expect(state.berechtigungstyp).toEqual('NONE');
        });
    });

    describe('all loadMkaAuthorizationFailed tests', () => {
        it.each([
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: 'NONE' }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: 'NONE' }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: 'NONE' }],
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: 'SCHULE' }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: 'SCHULE' }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: 'SCHULE' }],
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: 'PRIVAT' }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: 'PRIVAT' }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: 'PRIVAT' }],
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
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: 'NONE' }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: 'NONE' }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: 'NONE' }],
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: 'SCHULE' }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: 'SCHULE' }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: 'SCHULE' }],
            [{ authorizationLoadState: 'not-loaded', berechtigungstyp: 'PRIVAT' }],
            [{ authorizationLoadState: 'loaded', berechtigungstyp: 'PRIVAT' }],
            [{ authorizationLoadState: 'failed', berechtigungstyp: 'PRIVAT' }],
        ] as [MkaAuthorizationState][])(
            'should return initialState when userLoggedOut and authorizationState is $authorizationLoadState and veranstalterTyp is $veranstalterTyp',
            (actualState: MkaAuthorizationState) => {
                const state = mkaAuthorizationFeature.reducer(actualState, mkaAuthorizationActions.userLoggedOut());

                expect(state.authorizationLoadState).toEqual('not-loaded');
                expect(state.berechtigungstyp).toEqual('NONE');
            }
        );
    });
});
