import { inject, Injectable } from '@angular/core';
import { TeilnahmeHttpService } from '../teilnahme-http.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TeilnahmeActions } from './teilnahme.actions';
import { catchError, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Teilnahme } from '../../model/teilnahme.model';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { mapToErrorContext } from '@matheportal/shared-utils';
import { Store } from '@ngrx/store';
import { selectTeilnahmeLoadState } from './teilnahme.selectors';

@Injectable()
export class TeilnahmeEffects {
    #actions = inject(Actions);
    #httpService = inject(TeilnahmeHttpService);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #store = inject(Store);

    readonly ensurePrivatteilnahmeLoaded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(TeilnahmeActions.ensurePrivatteilnahmeLoaded),
            withLatestFrom(this.#store.select(selectTeilnahmeLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(() => TeilnahmeActions.privatteilnahmeLaden())
        )
    );

    readonly privatteilnahmeLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(TeilnahmeActions.privatteilnahmeLaden),
            switchMap(() =>
                this.#httpService.loadAktuellePrivatteilnahme().pipe(
                    map((teilnahme: Teilnahme) =>
                        TeilnahmeActions.teilnahmeGeladen({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) => of(TeilnahmeActions.teilnahmeLadenFailed({ error })))
                )
            )
        );
    });

    readonly teilnahmeLadenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(TeilnahmeActions.teilnahmeLadenFailed),
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
            ofType(TeilnahmeActions.privatteilnahmeAnmelden),
            exhaustMap(() =>
                this.#httpService.privatAnmelden().pipe(
                    map((teilnahme: Teilnahme) =>
                        TeilnahmeActions.teilnahmeAngemeldet({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) => of(TeilnahmeActions.teilnahmeAnmeldenFailed({ error })))
                )
            )
        )
    );
}
