import { User } from '@matheportal/auth-model';
import { Action } from '@ngrx/store';
import { firstValueFrom, Subject } from 'rxjs';
import { MinikaenguruEinstiegEffects } from './minikaenguru-einstieg.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { mkaAuthorizationLoaded } from '../authorization/authorization-api/mka-authorization-store.events';
import { ensureWettbewerbGeladen } from '../wettbewerb/api/wettbewerb-store.events';
import {
    durchfuehrenderAngelegt,
    durchfuehrenderGeladen,
    ensureDurchfuehrenderGeladen,
} from '../wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende-store.events';
import {
    DURCHFUEHRUNGSART,
    Wettbewerbsdurchfuehrender,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { MinikaenguruEinstiegActions } from './minikaenguru-einstieg.actions';
import { ensureSchulenGeladen } from '../../lehrperson/api/lehrperson-store.events';
import { ensureWettbewerbskontextPrivatGeladen } from '../../privatperson/api/privatperson-store.events';
import { ensureWettbewerbskontextSchuleGeladen } from '../../schule/api/schule-store.events';

describe('MinikaenguruEinstiegEffects', () => {
    let action$: Subject<Action>;
    let effects: MinikaenguruEinstiegEffects;

    beforeEach(() => {
        action$ = new Subject<Action>();

        TestBed.configureTestingModule({
            providers: [MinikaenguruEinstiegEffects, provideMockActions(() => action$)],
        });

        effects = TestBed.inject(MinikaenguruEinstiegEffects);
    });

    describe('wettbewerbLadenOnAuthorizationLoaded$', () => {
        it('should dispatch loadWettbewerb', async () => {
            const user: User = {
                anonym: false,
                berechtigungen: ['SCHULE', 'STANDARD'],
                fullName: 'Amy',
            };

            const promise = firstValueFrom(effects.wettbewerbLadenOnAuthorizationLoaded$);

            action$.next(mkaAuthorizationLoaded({ user }));

            const emitted = await promise;

            expect(emitted).toEqual(ensureWettbewerbGeladen);
        });
    });

    describe('durchfuehrendenLadenOnAuthorizationLoaded$', () => {
        it.each(['SCHULE', 'PRIVAT'])('should dispatch ensureDurchfuehrenderGeladen when rolle %s', async rolle => {
            const user: User = {
                anonym: false,
                berechtigungen: [rolle, 'STANDARD'],
                fullName: 'Amy',
            };

            const promise = firstValueFrom(effects.durchfuehrendenLadenOnAuthorizationLoaded$);

            action$.next(mkaAuthorizationLoaded({ user }));

            const emitted = await promise;

            expect(emitted).toEqual(ensureDurchfuehrenderGeladen);
        });

        it('should not dispatch durchfuehrendenLaden when keine Minikänguru-Rolle', async () => {
            const user: User = {
                anonym: false,
                berechtigungen: ['STANDARD'],
                fullName: 'Amy',
            };

            const emittedActions: Action[] = [];
            const subscription = effects.durchfuehrendenLadenOnAuthorizationLoaded$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(mkaAuthorizationLoaded({ user }));

            expect(emittedActions).toEqual([]);
            subscription.unsubscribe();
        });
    });

    describe('schulenLadenOnDurchfuehrenderAngelegtOrGeladen', () => {
        let wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender = {
            durchfuehrungsart: DURCHFUEHRUNGSART.privat,
            newsletter: false,
            zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
        };

        it('should not dispatch any action when durchfuehrenderAngelegt DURCHFUEHRUNGSART.privat', async () => {
            const emittedActions: Action[] = [];
            const subscription = effects.schulenLadenOnDurchfuehrenderAngelegtOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(durchfuehrenderAngelegt({ wettbewerbsdurchfuehrender }));

            expect(emittedActions).toEqual([]);

            subscription.unsubscribe();
        });

        it('should not dispatch any action when durchfuehrenderGeladen DURCHFUEHRUNGSART.privat', async () => {
            const emittedActions: Action[] = [];
            const subscription = effects.schulenLadenOnDurchfuehrenderAngelegtOrGeladen$.subscribe(action => {
                emittedActions.push(action);
            });

            action$.next(durchfuehrenderGeladen({ wettbewerbsdurchfuehrender }));

            expect(emittedActions).toEqual([]);

            subscription.unsubscribe();
        });

        it('should dispatch schulenLaden when durchfuehrenderAngelegt DURCHFUEHRUNGSART.schule', async () => {
            wettbewerbsdurchfuehrender = { ...wettbewerbsdurchfuehrender, durchfuehrungsart: DURCHFUEHRUNGSART.schule };

            const promise = firstValueFrom(effects.schulenLadenOnDurchfuehrenderAngelegtOrGeladen$);

            action$.next(durchfuehrenderAngelegt({ wettbewerbsdurchfuehrender }));

            const emitted = await promise;

            expect(emitted).toEqual(ensureSchulenGeladen);
        });

        it('should dispatch schulenLaden when durchfuehrenderGeladen DURCHFUEHRUNGSART.schule', async () => {
            wettbewerbsdurchfuehrender = { ...wettbewerbsdurchfuehrender, durchfuehrungsart: DURCHFUEHRUNGSART.schule };

            const promise = firstValueFrom(effects.schulenLadenOnDurchfuehrenderAngelegtOrGeladen$);

            action$.next(durchfuehrenderGeladen({ wettbewerbsdurchfuehrender }));

            const emitted = await promise;

            expect(emitted).toEqual(ensureSchulenGeladen);
        });
    });

    describe('kontextLadenOnWettbewerbsorganisationGestartet$', () => {
        const kontextkuerzel = 'X12345678';

        it('should map to ensureWettbewerbskontextSchuleGeladen when durchfuehrungsart schule', async () => {
            const promise = firstValueFrom(effects.kontextLadenOnWettbewerbsorganisationGestartet$);

            action$.next(
                MinikaenguruEinstiegActions.kontextLadenOnWettbewerbsorganisationGestartet({
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kontextkuerzel,
                })
            );

            const emitted = await promise;

            expect(emitted).toEqual(ensureWettbewerbskontextSchuleGeladen({ schulkuerzel: 'X12345678' }));
        });

        it('should map to ensureWettbewerbskontextPrivatGeladen when durchfuehrungsart privat', async () => {
            const promise = firstValueFrom(effects.kontextLadenOnWettbewerbsorganisationGestartet$);

            action$.next(
                MinikaenguruEinstiegActions.kontextLadenOnWettbewerbsorganisationGestartet({
                    durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                    kontextkuerzel,
                })
            );

            const emitted = await promise;

            expect(emitted).toEqual(ensureWettbewerbskontextPrivatGeladen());
        });
    });
});
