import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SchulkatalogHttpService } from '../schulkatalog-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { SchulkatalogActions } from './schulkatalog.actions';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { mapErrorToMessage } from '@matheportal/shared-utils';
import { SCHULKATALOG_ADMIN_KONTEXT } from '../../model/schulkatalog.model';

@Injectable() // services in den remotes dürfen nicht in root provided werden.
export class SchulkatalogEffects {
    #actions = inject(Actions);
    #httpService = inject(SchulkatalogHttpService);
    #messagePublisherService = inject(MESSAGE_PUBLISHER);

    readonly loadLaender$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.loadLaender),
            switchMap(() => {
                return this.#httpService.loadLaender().pipe(
                    map(laender => SchulkatalogActions.loadLaenderSucceeded({ laender })),
                    catchError((error: Error) =>
                        of(SchulkatalogActions.loadActionFailed({ kontext: SCHULKATALOG_ADMIN_KONTEXT.laender, error }))
                    )
                );
            })
        )
    );

    readonly landSelected$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(SchulkatalogActions.landSelected),
            map(({ land }) => SchulkatalogActions.loadOrte({ land }))
        );
    });

    readonly loadOrte$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.loadOrte),
            switchMap(({ land }) => {
                return this.#httpService.loadOrte(land.kuerzel).pipe(
                    map(orte => SchulkatalogActions.loadOrteSucceeded({ orte })),
                    catchError((error: Error) =>
                        of(SchulkatalogActions.loadActionFailed({ kontext: SCHULKATALOG_ADMIN_KONTEXT.orte, error }))
                    )
                );
            })
        )
    );

    readonly ortSelected$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(SchulkatalogActions.ortSelected),
            map(({ ort }) => SchulkatalogActions.loadSchulen({ ort }))
        );
    });

    readonly loadSchulen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.loadSchulen),
            switchMap(({ ort }) => {
                return this.#httpService.loadSchulen(ort.kuerzel).pipe(
                    map(schulen => SchulkatalogActions.loadSchulenSucceeded({ schulen })),
                    catchError((error: Error) =>
                        of(SchulkatalogActions.loadActionFailed({ kontext: SCHULKATALOG_ADMIN_KONTEXT.schulen, error }))
                    )
                );
            })
        )
    );

    readonly landMitOrtUndSchuleAnlegen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.landMitOrtUndSchuleAnlegen),
            exhaustMap(({ payload }) => {
                return this.#httpService.landMitOrtUndSchuleAnlegen(payload).pipe(
                    map(schulkuerzel => SchulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded({ schulkuerzel })),
                    catchError((error: Error) => of(SchulkatalogActions.changeActionFailed({ error })))
                );
            })
        )
    );

    readonly landMitOrtUndSchuleAnlegenSucceeded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded),
            tap(({ schulkuerzel }) => {
                this.#messagePublisherService.publishInfo(`Neue Schule angelegt. Kürzel: ${schulkuerzel.kuerzel}`);
            }),
            map(() => SchulkatalogActions.loadLaender())
        )
    );

    readonly ortMitSchuleAnlegen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.ortMitSchuleAnlegen),
            exhaustMap(({ land, payload }) => {
                return this.#httpService.ortMitSchuleInLandAnlegen(land.kuerzel, payload).pipe(
                    map(schulkuerzel => SchulkatalogActions.ortMitSchuleAnlegenSucceeded({ land, schulkuerzel })),
                    catchError((error: Error) => of(SchulkatalogActions.changeActionFailed({ error })))
                );
            })
        )
    );

    readonly ortMitSchuleAnlegenSucceeded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.ortMitSchuleAnlegenSucceeded),
            tap(({ schulkuerzel }) => {
                this.#messagePublisherService.publishInfo(`Neue Schule angelegt. Kürzel: ${schulkuerzel.kuerzel}`);
            }),
            map(action => SchulkatalogActions.loadOrte({ land: action.land }))
        )
    );

    readonly schuleAnlegen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.schuleAnlegen),
            exhaustMap(({ ort, payload }) => {
                return this.#httpService.schuleInOrtAnlegen(ort.kuerzel, payload).pipe(
                    map(schulkuerzel => SchulkatalogActions.schuleAnlegenSucceeded({ ort, schulkuerzel })),
                    catchError((error: Error) => of(SchulkatalogActions.changeActionFailed({ error })))
                );
            })
        )
    );

    readonly schuleAnlegenSucceeded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.schuleAnlegenSucceeded),
            tap(({ schulkuerzel }) => {
                this.#messagePublisherService.publishInfo(`Neue Schule angelegt. Kürzel: ${schulkuerzel.kuerzel}`);
            }),
            map(action => SchulkatalogActions.loadSchulen({ ort: action.ort }))
        )
    );

    readonly schuleUmbenennen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.schuleUmbenennen),
            exhaustMap(({ schule, payload }) => {
                return this.#httpService.schuleUmbenennen(schule.kuerzel, payload).pipe(
                    map(schulkuerzel => SchulkatalogActions.schuleUmbenennenSucceeded({ schule, schulkuerzel })),
                    catchError((error: Error) => of(SchulkatalogActions.changeActionFailed({ error })))
                );
            })
        )
    );

    readonly schuleUmbenennenSucceeded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulkatalogActions.schuleUmbenennenSucceeded),
            tap(({ schulkuerzel }) => {
                this.#messagePublisherService.publishInfo(
                    `Schule erfolgreich umbenannt. Kürzel: ${schulkuerzel.kuerzel}`
                );
            }),
            map(action => SchulkatalogActions.loadSchulen({ ort: action.schule.ort }))
        )
    );

    readonly actionFailed$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(SchulkatalogActions.loadActionFailed, SchulkatalogActions.changeActionFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisherService.publishError(errorMessage);
                })
            );
        },
        { dispatch: false }
    );
}
