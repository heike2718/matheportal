import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SchulkatalogsucheHttpService } from '../schulkatalogsuche-http.service';
import { SchulkatalogsucheActions } from './schulkatalogsuche.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Ort, Schule } from '../../../../core/model/schulkatalog.model';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { isTermSearchable, normalizeSearchTerm } from '../schulkatalogsuche-data.utils';
import { mapErrorToMessage } from '@matheportal/shared-utils';

@Injectable() // services in den remotes dürfen nicht in root provided werden.
export class SchulkatalogsucheEffects {
    #actions = inject(Actions);
    #httpService = inject(SchulkatalogsucheHttpService);
    #messagePublisherService = inject(MESSAGE_PUBLISHER);

    findOrte$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogsucheActions.findOrte),
            map(({ name }) => normalizeSearchTerm(name)),
            switchMap(term => {
                if (!isTermSearchable(term)) {
                    return of(SchulkatalogsucheActions.orteCleared());
                }
                return this.#httpService.findOrte(term).pipe(
                    map((orte: Ort[]) => SchulkatalogsucheActions.findOrteSucceeded({ orte })),
                    catchError((error: Error) => of(SchulkatalogsucheActions.findOrteFailed({ error })))
                );
            })
        )
    );

    findOrteFailed$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(SchulkatalogsucheActions.findOrteFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisherService.publishError(errorMessage);
                })
            );
        },
        { dispatch: false }
    );

    ortSelected$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(SchulkatalogsucheActions.ortSelected),
            map(({ ort }) => SchulkatalogsucheActions.loadSchulen({ ort }))
        );
    });

    loadSchulen$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(SchulkatalogsucheActions.loadSchulen),
            switchMap(({ ort }) =>
                this.#httpService.loadSchulen(ort.kuerzel).pipe(
                    map((schulen: Schule[]) =>
                        SchulkatalogsucheActions.loadSchulenSucceeded({ ortId: ort.kuerzel, schulen })
                    ),
                    catchError((error: Error) => of(SchulkatalogsucheActions.loadSchulenFailed({ error })))
                )
            )
        );
    });

    loadSchulenFailed$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(SchulkatalogsucheActions.loadSchulenFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisherService.publishError(errorMessage);
                })
            );
        },
        { dispatch: false }
    );
}
