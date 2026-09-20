import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SchulkatalogHttpService } from '../schulkatalog-http.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { schulkatalogActions } from './schulkatalog.actions';
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
            ofType(schulkatalogActions.loadLaender),
            switchMap(() => {
                return this.#httpService.loadLaender().pipe(
                    map(laender => schulkatalogActions.loadLaenderSucceeded({ laender })),
                    catchError((error: Error) =>
                        of(schulkatalogActions.loadActionFailed({ kontext: SCHULKATALOG_ADMIN_KONTEXT.laender, error }))
                    )
                );
            })
        )
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
                    catchError((error: Error) =>
                        of(schulkatalogActions.loadActionFailed({ kontext: SCHULKATALOG_ADMIN_KONTEXT.orte, error }))
                    )
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
                    catchError((error: Error) =>
                        of(schulkatalogActions.loadActionFailed({ kontext: SCHULKATALOG_ADMIN_KONTEXT.schulen, error }))
                    )
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
                    catchError((error: Error) => of(schulkatalogActions.changeActionFailed({ error })))
                );
            })
        )
    );

    readonly landMitOrtUndSchuleAnlegenSucceeded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded),
            tap(({ schulkuerzel }) => {
                this.#messagePublisherService.publishInfo(`Neue Schule angelegt. Kürzel: ${schulkuerzel.kuerzel}`);
            }),
            map(() => schulkatalogActions.loadLaender())
        )
    );

    readonly ortMitSchuleAnlegen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.ortMitSchuleAnlegen),
            exhaustMap(({ land, payload }) => {
                return this.#httpService.ortMitSchuleInLandAnlegen(land.kuerzel, payload).pipe(
                    map(schulkuerzel => schulkatalogActions.ortMitSchuleAnlegenSucceeded({ land, schulkuerzel })),
                    catchError((error: Error) => of(schulkatalogActions.changeActionFailed({ error })))
                );
            })
        )
    );

    readonly ortMitSchuleAnlegenSucceeded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.ortMitSchuleAnlegenSucceeded),
            tap(({ schulkuerzel }) => {
                this.#messagePublisherService.publishInfo(`Neue Schule angelegt. Kürzel: ${schulkuerzel.kuerzel}`);
            }),
            map(action => schulkatalogActions.loadOrte({ land: action.land }))
        )
    );

    readonly schuleAnlegen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.schuleAnlegen),
            exhaustMap(({ ort, payload }) => {
                return this.#httpService.schuleInOrtAnlegen(ort.kuerzel, payload).pipe(
                    map(schulkuerzel => schulkatalogActions.schuleAnlegenSucceeded({ ort, schulkuerzel })),
                    catchError((error: Error) => of(schulkatalogActions.changeActionFailed({ error })))
                );
            })
        )
    );

    readonly schuleAnlegenSucceeded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.schuleAnlegenSucceeded),
            tap(({ schulkuerzel }) => {
                this.#messagePublisherService.publishInfo(`Neue Schule angelegt. Kürzel: ${schulkuerzel.kuerzel}`);
            }),
            map(action => schulkatalogActions.loadSchulen({ ort: action.ort }))
        )
    );

    readonly schuleUmbenennen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.schuleUmbenennen),
            exhaustMap(({ schule, payload }) => {
                return this.#httpService.schuleUmbenennen(schule.kuerzel, payload).pipe(
                    map(schulkuerzel => schulkatalogActions.schuleUmbenennenSucceeded({ schule, schulkuerzel })),
                    catchError((error: Error) => of(schulkatalogActions.changeActionFailed({ error })))
                );
            })
        )
    );

    readonly schuleUmbenennenSucceeded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.schuleUmbenennenSucceeded),
            tap(({ schulkuerzel }) => {
                this.#messagePublisherService.publishInfo(
                    `Schule erfolgreich umbenannt. Kürzel: ${schulkuerzel.kuerzel}`
                );
            }),
            map(action => schulkatalogActions.loadSchulen({ ort: action.schule.ort }))
        )
    );

    readonly actionFailed$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(schulkatalogActions.loadActionFailed, schulkatalogActions.changeActionFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisherService.publishError(errorMessage);
                })
            );
        },
        { dispatch: false }
    );
}
