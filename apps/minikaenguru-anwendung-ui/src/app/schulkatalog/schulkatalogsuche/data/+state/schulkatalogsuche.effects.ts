import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SchulkatalogsucheHttpService } from '../schulkatalogsuche-http.service';
import { schulkatalogsucheActions } from './schulkatalogsuche.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { mapErrorToMessage } from '../../../../core/error/minikaenguru-error-mapper';

@Injectable() // services in den remotes dürfen nicht in root provided werden.
export class SchulkatalogsucheEffects {
    #actions = inject(Actions);
    #httpService = inject(SchulkatalogsucheHttpService);
    #messagePublisherService = inject(MESSAGE_PUBLISHER);

    findOrte$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schulkatalogsucheActions.findOrte),
            switchMap(({ name }) =>
                this.#httpService.findOrte(name).pipe(
                    map((orte: Ort[]) => schulkatalogsucheActions.findOrteSucceeded({ orte })),
                    catchError((error: Error) => of(schulkatalogsucheActions.findOrteFailed({ error })))
                )
            )
        );
    });

    findOrteFailed$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(schulkatalogsucheActions.findOrteFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisherService.publishError(errorMessage);
                })
            );
        },
        { dispatch: false }
    );

    loadSchulen$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schulkatalogsucheActions.loadSchulen),
            switchMap(({ ort }) =>
                this.#httpService.loadSchulen(ort.kuerzel).pipe(
                    map((schulen: Schule[]) =>
                        schulkatalogsucheActions.loadSchulenSucceeded({ ortId: ort.kuerzel, schulen })
                    ),
                    catchError((error: Error) => of(schulkatalogsucheActions.loadSchulenFailed({ error })))
                )
            )
        );
    });

    loadSchulenFailed$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(schulkatalogsucheActions.loadSchulenFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisherService.publishError(errorMessage);
                })
            );
        },
        { dispatch: false }
    );
}
