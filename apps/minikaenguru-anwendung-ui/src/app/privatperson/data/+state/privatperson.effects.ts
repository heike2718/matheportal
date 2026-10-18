import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ArbeitskontextHttpService } from '../../../core/services/arbeitskontext-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { ensureWettbewerbskontextPrivatGeladen } from '../../api/privatperson-store.events';
import { catchError, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { PrivatpersonActions } from './privatperson.actions';
import { Store } from '@ngrx/store';
import { selectWettbewerbskontextLadenVerweigert } from './privatperson.selectors';
import { mapToErrorContext } from '@matheportal/shared-utils';

@Injectable()
export class PrivatpersonEffects {
    #actions = inject(Actions);
    #httpService = inject(ArbeitskontextHttpService);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #store = inject(Store);

    readonly ensureWettbewerbskontextPrivatGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(ensureWettbewerbskontextPrivatGeladen),
            map(() => PrivatpersonActions.wettbewerbskontextLaden())
        )
    );

    readonly wettbewerbskontextLaden$ = createEffect(() =>
        this.#actions.pipe(
            ofType(PrivatpersonActions.wettbewerbskontextLaden),
            withLatestFrom(this.#store.select(selectWettbewerbskontextLadenVerweigert)),
            filter(([, verweigert]) => (verweigert = !verweigert)),
            switchMap(() =>
                this.#httpService.loadPrivatpersonWettbewerbskontext().pipe(
                    map(wettbewerbskontext => PrivatpersonActions.wettbewerbskontextGeladen({ wettbewerbskontext })),
                    catchError((error: Error) => of(PrivatpersonActions.wettbewerbskontextLadenFailed({ error })))
                )
            )
        )
    );

    readonly wettbewerbskontextLadenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(PrivatpersonActions.wettbewerbskontextLadenFailed),
                tap(action => {
                    const errorContext = mapToErrorContext(action.error);
                    this.#messagePublisher.publishError(errorContext.message);
                })
            ),
        { dispatch: false }
    );
}
