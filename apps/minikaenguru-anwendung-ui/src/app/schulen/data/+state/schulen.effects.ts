import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import {
    durchfuehrenderAngelegt,
    durchfuehrenderGeladen,
} from '../../../core/wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende-store.events';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { DURCHFUEHRUNGSART } from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { schulenActions } from './schulen.actions';
import { mapErrorToMessage } from '@matheportal/shared-utils';
import { ArbeitskontextHttpService } from '../../../core/services/arbeitskontext-http.service';
import { wettbewerbsorganisationGestartet } from '../../../lehrperson/api/lehrperson-store.events';

@Injectable()
export class SchulenEffects {
    #httpService = inject(ArbeitskontextHttpService);
    #actions = inject(Actions);
    #messagePublisher = inject(MESSAGE_PUBLISHER);

    readonly checkLoadSchulenOnWettbewerbsdurchfuehrenderGeladen$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(durchfuehrenderGeladen, durchfuehrenderAngelegt),
            filter(
                ({ wettbewerbsdurchfuehrender }) =>
                    wettbewerbsdurchfuehrender.durchfuehrungsart === DURCHFUEHRUNGSART.schule
            ),
            map(() => schulenActions.schulenLaden())
        );
    });

    readonly schulenLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schulenActions.schulenLaden),
            switchMap(() =>
                this.#httpService.loadLehrpersonSchulen().pipe(
                    map(schulen => schulenActions.schulenGeladen({ schulen })),
                    catchError((error: Error) => of(schulenActions.schulenLadenFailed({ error })))
                )
            )
        );
    });

    readonly wettbewerbsorganisationGestartet$ = createEffect(() =>
        this.#actions.pipe(
            ofType(wettbewerbsorganisationGestartet),
            map(({ schule }) => schulenActions.wettbewerbskontextLaden({ schule }))
        )
    );

    readonly wettbewerbskontextLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schulenActions.wettbewerbskontextLaden),
            switchMap(({ schule }) =>
                this.#httpService.loadSchuleWettbewerbskontext(schule.kuerzel).pipe(
                    map(wettbewerbskontext => schulenActions.wettbewerbskontextGeladen({ wettbewerbskontext })),
                    catchError((error: Error) => of(schulenActions.wettbewerbskontextLadenFailed({ error })))
                )
            )
        );
    });

    readonly wettbewerbskontextGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulenActions.wettbewerbskontextGeladen),
            map(({ wettbewerbskontext }) => schulenActions.schulkollegiumLaden({ schule: wettbewerbskontext.schule }))
        )
    );

    readonly schulkollegiumLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schulenActions.schulkollegiumLaden),
            switchMap(({ schule }) =>
                this.#httpService.loadSchulkollegium(schule.kuerzel).pipe(
                    map(schulkollegium => schulenActions.schulkollegiumGeladen({ schulkollegium })),
                    catchError((error: Error) => of(schulenActions.schulkollegiumLadenFailed({ error })))
                )
            )
        );
    });

    readonly loadActionFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(schulenActions.schulenLadenFailed, schulenActions.wettbewerbskontextLadenFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisher.publishError(errorMessage);
                })
            ),
        { dispatch: false }
    );
}
