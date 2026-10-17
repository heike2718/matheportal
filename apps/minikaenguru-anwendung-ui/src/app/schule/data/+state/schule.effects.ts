import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { SchuleActions } from './schule.actions';
import { mapToErrorContext } from '@matheportal/shared-utils';
import { ArbeitskontextHttpService } from '../../../core/services/arbeitskontext-http.service';
import { portalRoutes } from '@matheportal/portal-navigation';
import { Router } from '@angular/router';

@Injectable()
export class SchulenEffects {
    #actions = inject(Actions);
    #httpService = inject(ArbeitskontextHttpService);
    #router = inject(Router);
    #messagePublisher = inject(MESSAGE_PUBLISHER);

    readonly ensureWettbewerbskontextGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchuleActions.ensureWettbewerbskontextGeladen),
            map(({ schulkuerzel }) => SchuleActions.wettbewerbskontextLaden({ schulkuerzel }))
        )
    );

    readonly wettbewerbskontextLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(SchuleActions.wettbewerbskontextLaden),
            switchMap(({ schulkuerzel }) =>
                this.#httpService.loadSchuleWettbewerbskontext(schulkuerzel).pipe(
                    map(wettbewerbskontext => SchuleActions.wettbewerbskontextGeladen({ wettbewerbskontext })),
                    catchError((error: Error) => of(SchuleActions.wettbewerbskontextLadenFailed({ error })))
                )
            )
        );
    });

    readonly wettbewerbskontextGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchuleActions.wettbewerbskontextGeladen),
            map(({ wettbewerbskontext }) => SchuleActions.schulkollegiumLaden({ schule: wettbewerbskontext.schule }))
        )
    );

    readonly schulkollegiumLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(SchuleActions.schulkollegiumLaden),
            switchMap(({ schule }) =>
                this.#httpService.loadSchulkollegium(schule.kuerzel).pipe(
                    map(schulkollegium => SchuleActions.schulkollegiumGeladen({ schulkollegium })),
                    catchError((error: Error) => of(SchuleActions.schulkollegiumLadenFailed({ error })))
                )
            )
        );
    });

    readonly wettbewerbskontextLadenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(SchuleActions.wettbewerbskontextLadenFailed),
                tap(action => {
                    const errorContext = mapToErrorContext(action.error);
                    this.#messagePublisher.publishError(errorContext.message);
                })
            ),
        { dispatch: false }
    );

    readonly wettbewerbsorganisationVerlassen$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(SchuleActions.wettbewerbsorganisationVerlassen),
                tap(() => {
                    // void ignoriert das Promise vom router. Dann hängt es nicht blöd in der Gegend herum.
                    void this.#router.navigate([
                        '/',
                        portalRoutes.minikaenguruAnwendung.root,
                        portalRoutes.minikaenguruAnwendung.lehrperson,
                    ]);
                })
            ),
        { dispatch: false }
    );
}
