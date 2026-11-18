import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { mapToErrorContext } from '@matheportal/shared-utils';
import { Store } from '@ngrx/store';
import { PrivatteilnahmeHttpService } from '../privatteilnahme-http.service';
import { PrivatteilnahmeActions } from './privatteilnahme.actions';
import { selectTeilnahmeLoadState } from './privatteilnahme.selectors';
import { Teilnahme } from '../../../model/teilnahme.model';

@Injectable()
export class PrivatteilnahmeEffects {
    #actions = inject(Actions);
    #httpService = inject(PrivatteilnahmeHttpService);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #store = inject(Store);

    readonly ensurePrivatteilnahmeLoaded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(PrivatteilnahmeActions.ensurePrivatteilnahmeLoaded),
            withLatestFrom(this.#store.select(selectTeilnahmeLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(() => PrivatteilnahmeActions.privatteilnahmeLaden())
        )
    );

    readonly privatteilnahmeLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(PrivatteilnahmeActions.privatteilnahmeLaden),
            switchMap(() =>
                this.#httpService.loadAktuellePrivatteilnahme().pipe(
                    map((teilnahme: Teilnahme) =>
                        PrivatteilnahmeActions.teilnahmeGeladen({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) => of(PrivatteilnahmeActions.teilnahmeLadenFailed({ error })))
                )
            )
        );
    });

    readonly teilnahmeLadenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(PrivatteilnahmeActions.teilnahmeLadenFailed),
                tap(action => {
                    const errorContext = mapToErrorContext(action.error, true);
                    if (errorContext.httpStatus !== 404) {
                        this.#messagePublisher.publishError(errorContext.message);
                    } else {
                        this.#messagePublisher.publishWarning(
                            'Sie sind noch nicht zum aktuellen Wettbewerb angemeldet.'
                        );
                    }
                })
            ),
        { dispatch: false }
    );

    readonly privatteilnahmeAnmelden$ = createEffect(() =>
        this.#actions.pipe(
            ofType(PrivatteilnahmeActions.privatteilnahmeAnmelden),
            exhaustMap(() =>
                this.#httpService.privatAnmelden().pipe(
                    map((teilnahme: Teilnahme) =>
                        PrivatteilnahmeActions.teilnahmeAngemeldet({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) => of(PrivatteilnahmeActions.teilnahmeAnmeldenFailed({ error })))
                )
            )
        )
    );

    readonly teilnahmeAnmeldenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(PrivatteilnahmeActions.teilnahmeAnmeldenFailed),
                tap(action => {
                    const errorContext = mapToErrorContext(action.error, false);
                    this.#messagePublisher.publishError(errorContext.message);
                })
            ),
        { dispatch: false }
    );
}
