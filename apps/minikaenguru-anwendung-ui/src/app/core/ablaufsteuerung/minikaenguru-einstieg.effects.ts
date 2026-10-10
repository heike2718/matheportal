import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mkaAuthorizationLoaded } from '../authorization/authorization-api/mka-authorization-store.events';
import { filter, map } from 'rxjs';
import { ensureWettbewerbGeladen } from '../wettbewerb/api/wettbewerb-store.events';
import { hasBerechtigungFuerMinikaenguru } from '../utils/minikaenguru.utils';
import {
    ensureDurchfuehrenderGeladen,
    durchfuehrenderAngelegt,
    durchfuehrenderGeladen,
} from '../wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende-store.events';
import { DURCHFUEHRUNGSART } from '../wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { ensureSchulenGeladen } from '../../schulen/api/schulen-store.events';

@Injectable()
export class MinikaenguruEinstiegEffects {
    #actions = inject(Actions);

    readonly wettbewerbLadenOnAuthorizationLoaded$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(mkaAuthorizationLoaded),
            map(() => ensureWettbewerbGeladen)
        );
    });

    readonly durchfuehrendenLadenOnAuthorizationLoaded$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(mkaAuthorizationLoaded),
            filter(({ user }) => hasBerechtigungFuerMinikaenguru(user)),
            map(() => ensureDurchfuehrenderGeladen)
        );
    });

    readonly schulenLadenOnDurchfuehrenderAngelegtOrGeladen$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(durchfuehrenderGeladen, durchfuehrenderAngelegt),
            filter(
                ({ wettbewerbsdurchfuehrender }) =>
                    wettbewerbsdurchfuehrender.durchfuehrungsart === DURCHFUEHRUNGSART.schule
            ),
            map(() => ensureSchulenGeladen)
        );
    });
}
