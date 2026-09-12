import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SchulkatalogHttpService } from '../schulkatalog-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { schulkatalogActions } from './schulkatalog.actions';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { mapErrorToMessage } from '@matheportal/shared-utils';

@Injectable() // services in den remotes dürfen nicht in root provided werden.
export class SchulkatalogEffects {
    #actions = inject(Actions);
    #httpService = inject(SchulkatalogHttpService);
    #messagePublisherService = inject(MESSAGE_PUBLISHER);

    readonly loadLaender$ = createEffect(() =>
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

    readonly loadLaenderFailed$ = createEffect(
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

    readonly landSelected$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schulkatalogActions.landSelected),
            map(({ land }) => schulkatalogActions.loadOrte({ land }))
        );
    });

    readonly loadOrte$ = createEffect(() =>
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

    readonly ortSelected$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schulkatalogActions.ortSelected),
            map(({ ort }) => schulkatalogActions.loadSchulen({ ort }))
        );
    });

    readonly loadSchulen$ = createEffect(() =>
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

    readonly landMitOrtUndSchuleAnlegen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.landMitOrtUndSchuleAnlegen),
            exhaustMap(({ payload }) => {
                return this.#httpService.landMitOrtUndSchuleAnlegen(payload).pipe(
                    map(schulkuerzel => schulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded({ schulkuerzel })),
                    catchError((error: Error) => of(schulkatalogActions.landMitOrtUndSchuleAnlegenFailed({ error })))
                );
            })
        )
    );

    readonly ortMitSchuleAnlegen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.ortMitSchuleAnlegen),
            exhaustMap(({ kuerzelLand, payload }) => {
                return this.#httpService.ortMitSchuleInLandAnlegen(kuerzelLand, payload).pipe(
                    map(schulkuerzel => schulkatalogActions.ortMitSchuleAnlegenSucceeded({ schulkuerzel })),
                    catchError((error: Error) => of(schulkatalogActions.ortMitSchuleAnlegenFailed({ error })))
                );
            })
        )
    );

    readonly schuleAnlegen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.schuleAnlegen),
            exhaustMap(({ kuerzelOrt, payload }) => {
                return this.#httpService.schuleInOrtAnlegen(kuerzelOrt, payload).pipe(
                    map(schulkuerzel => schulkatalogActions.schuleAnlegenSucceeded({ schulkuerzel })),
                    catchError((error: Error) => of(schulkatalogActions.schuleAnlegenFailed({ error })))
                );
            })
        )
    );

    readonly schuleUmbenennen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.schuleUmbenennen),
            exhaustMap(({ kuerzelSchule, payload }) => {
                return this.#httpService.schuleUmbenennen(kuerzelSchule, payload).pipe(
                    map(schulkuerzel => schulkatalogActions.schuleUmbenennenSucceeded({ schulkuerzel })),
                    catchError((error: Error) => of(schulkatalogActions.schuleUmbenennenFailed({ error })))
                );
            })
        )
    );
}
