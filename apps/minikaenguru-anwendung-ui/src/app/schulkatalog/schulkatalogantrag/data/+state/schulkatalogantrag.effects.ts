import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SchulkatalogantragHttpService } from '../schulkatalogantrag-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { SchulkatalogantragActions } from './schulkatalogantrag.actions';
import { mapErrorToMessage } from '@matheportal/shared-utils';

@Injectable()
export class SchulkatalogantragEffects {
    #infoMessage =
        'Vielen Dank! Wir haben Ihre Anfrage erhalten und werden die Schule zeitnah in unseren Schulkatalog aufnehmen. Sobald die Schule eingetragen ist, erhalten Sie eine E-Mail.';

    #actions = inject(Actions);
    #httpService = inject(SchulkatalogantragHttpService);
    #messagePublisherService = inject(MESSAGE_PUBLISHER);

    readonly submitSchulkatalogantrag$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogantragActions.submitSchulkatalogantrag),
            exhaustMap(({ antrag }) => {
                return this.#httpService.submitSchulkatalogantrag(antrag).pipe(
                    map(() => SchulkatalogantragActions.submitSchulkatalogantragSucceeded()),
                    catchError((error: Error) =>
                        of(SchulkatalogantragActions.submitSchulkatalogantragFailed({ error }))
                    )
                );
            })
        )
    );

    readonly submitSchulkatalogantragSucceeded$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(SchulkatalogantragActions.submitSchulkatalogantragSucceeded),
                tap(() => {
                    this.#messagePublisherService.publishInfo(this.#infoMessage);
                })
            );
        },
        { dispatch: false }
    );

    readonly submitSchulkatalogantragFailed$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(SchulkatalogantragActions.submitSchulkatalogantragFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisherService.publishError(errorMessage);
                })
            );
        },
        { dispatch: false }
    );
}
