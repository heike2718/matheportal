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
            expect(state.veranstaltertyp).toEqual('NONE');
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const state = mkaAuthorizationFeature.reducer(
                { authorizationLoadState: 'loaded', veranstaltertyp: 'LEHRER' },
                unknownAction
            );
            expect(state.authorizationLoadState).toEqual('loaded');
            expect(state.veranstaltertyp).toEqual('LEHRER');
        });
    });

    describe('mkaAuthorizationLoaded tests', () => {
        it('should return loaded and lehrer, when initial state and loaded with berechtigung LEHRER', () => {
            const actualState: MkaAuthorizationState = {
                authorizationLoadState: 'not-loaded',
                veranstaltertyp: 'NONE',
            };
            const user: User = {
                anonym: false,
                fullName: 'Jonny Lehrer',
                berechtigungen: ['LEHRER'],
            };
            const state = mkaAuthorizationFeature.reducer(
                actualState,
                mkaAuthorizationActions.mkaAuthorizationLoaded({ user })
            );
            expect(state.authorizationLoadState).toEqual('loaded');
            expect(state.veranstaltertyp).toEqual('LEHRER');
        });
        it('should return loaded and privat, when initial state and loaded with berechtigung PRIVAT', () => {
            const actualState: MkaAuthorizationState = {
                authorizationLoadState: 'not-loaded',
                veranstaltertyp: 'NONE',
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
            expect(state.veranstaltertyp).toEqual('PRIVAT');
        });
        it('should return loaded and none, when initial state and loaded without MK-Berechtigungen', () => {
            const actualState: MkaAuthorizationState = {
                authorizationLoadState: 'not-loaded',
                veranstaltertyp: 'NONE',
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
            expect(state.veranstaltertyp).toEqual('NONE');
        });
    });

    describe('all loadMkaAuthorizationFailed tests', () => {
        it.each([
            [{ authorizationLoadState: 'not-loaded', veranstaltertyp: 'NONE' }],
            [{ authorizationLoadState: 'loaded', veranstaltertyp: 'NONE' }],
            [{ authorizationLoadState: 'failed', veranstaltertyp: 'NONE' }],
            [{ authorizationLoadState: 'not-loaded', veranstaltertyp: 'LEHRER' }],
            [{ authorizationLoadState: 'loaded', veranstaltertyp: 'LEHRER' }],
            [{ authorizationLoadState: 'failed', veranstaltertyp: 'LEHRER' }],
            [{ authorizationLoadState: 'not-loaded', veranstaltertyp: 'PRIVAT' }],
            [{ authorizationLoadState: 'loaded', veranstaltertyp: 'PRIVAT' }],
            [{ authorizationLoadState: 'failed', veranstaltertyp: 'PRIVAT' }],
        ] as [MkaAuthorizationState][])(
            'should return failed when authorizationLoadState is $authorizationLoadState and veranstalterTyp is $veranstalterTyp',
            (actualState: MkaAuthorizationState) => {
                const state = mkaAuthorizationFeature.reducer(
                    actualState,
                    mkaAuthorizationActions.loadMkaAuthorizationFailed()
                );

                expect(state.authorizationLoadState).toEqual('failed');
                expect(state.veranstaltertyp).toEqual(actualState.veranstaltertyp);
            }
        );
    });

    describe('all userLoggedOut tests', () => {
        it.each([
            [{ authorizationLoadState: 'not-loaded', veranstaltertyp: 'NONE' }],
            [{ authorizationLoadState: 'loaded', veranstaltertyp: 'NONE' }],
            [{ authorizationLoadState: 'failed', veranstaltertyp: 'NONE' }],
            [{ authorizationLoadState: 'not-loaded', veranstaltertyp: 'LEHRER' }],
            [{ authorizationLoadState: 'loaded', veranstaltertyp: 'LEHRER' }],
            [{ authorizationLoadState: 'failed', veranstaltertyp: 'LEHRER' }],
            [{ authorizationLoadState: 'not-loaded', veranstaltertyp: 'PRIVAT' }],
            [{ authorizationLoadState: 'loaded', veranstaltertyp: 'PRIVAT' }],
            [{ authorizationLoadState: 'failed', veranstaltertyp: 'PRIVAT' }],
        ] as [MkaAuthorizationState][])(
            'should return initialState when userLoggedOut and authorizationState is $authorizationLoadState and veranstalterTyp is $veranstalterTyp',
            (actualState: MkaAuthorizationState) => {
                const state = mkaAuthorizationFeature.reducer(actualState, mkaAuthorizationActions.userLoggedOut());

                expect(state.authorizationLoadState).toEqual('not-loaded');
                expect(state.veranstaltertyp).toEqual('NONE');
            }
        );
    });
});
