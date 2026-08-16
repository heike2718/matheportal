import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SchulkatalogHttpService } from '../schulkatalog-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { schulkatalogActions } from './schulkatalog.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { mapErrorToMessage } from '@matheportal/shared-utils';

@Injectable() // services in den remotes dürfen nicht in root provided werden.
export class SchulkatalogEffects {
    #actions = inject(Actions);
    #httpService = inject(SchulkatalogHttpService);
    #messagePublisherService = inject(MESSAGE_PUBLISHER);

    loadLaender$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.loadLaender),
            switchMap(() => {
                return this.#httpService.loadLaender().pipe(
                    map(laender => schulkatalogActions.loadLaenderSucceeded({ laender })),
                    catchError((error: Error) => of(schulkatalogActions.loadLaenderFailed({ error })))
                );
            })
        )
    );

    loadLaenderFailed$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(schulkatalogActions.loadLaenderFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisherService.publishError(errorMessage);
                })
            );
        },
        { dispatch: false }
    );

    landSelected$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schulkatalogActions.landSelected),
            map(({ land }) => schulkatalogActions.loadOrte({ land }))
        );
    });

    loadOrte$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.loadOrte),
            switchMap(({ land }) => {
                return this.#httpService.loadOrte(land.kuerzel).pipe(
                    map(orte => schulkatalogActions.loadOrteSucceeded({ orte })),
                    catchError((error: Error) => of(schulkatalogActions.loadOrteFailed({ error })))
                );
            })
        )
    );

    ortSelected$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schulkatalogActions.ortSelected),
            map(({ ort }) => schulkatalogActions.loadSchulen({ ort }))
        );
    });

    loadSchulen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.loadSchulen),
            switchMap(({ ort }) => {
                return this.#httpService.loadSchulen(ort.kuerzel).pipe(
                    map(schulen => schulkatalogActions.loadSchulenSucceeded({ schulen })),
                    catchError((error: Error) => of(schulkatalogActions.loadSchulenFailed({ error })))
                );
            })
        )
    );
}
