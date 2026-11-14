import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { catchError, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { SchuleActions } from './schule.actions';
import { mapToErrorContext } from '@matheportal/shared-utils';
import { ArbeitskontextHttpService } from '../../../core/services/arbeitskontext-http.service';
import { portalRoutes } from '@matheportal/portal-navigation';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { schulenLadenVerweigert } from '../../../lehrperson/api/public-lehrperson.selectors';
import { Dialog } from '@angular/cdk/dialog';
import { AuswertungsartDialogData, AuswertungsartDialogResult } from '../../../teilnahme/model/teilnahme.model';
import { AuswertungsartDialogComponent } from '../../../shared/components/auswertungsart-dialog/auswertungsart-dialog.component';
import { schulteilnahmeAnmelden } from '../../../teilnahme/api/teilnahme-store.events';

@Injectable()
export class SchulenEffects {
    #actions = inject(Actions);
    #httpService = inject(ArbeitskontextHttpService);
    #router = inject(Router);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #store = inject(Store);
    #dialog = inject(Dialog);

    readonly ensureWettbewerbskontextGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchuleActions.ensureWettbewerbskontextGeladen),
            map(({ schulkuerzel }) => SchuleActions.wettbewerbskontextLaden({ schulkuerzel }))
        )
    );

    readonly wettbewerbskontextLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(SchuleActions.wettbewerbskontextLaden),
            withLatestFrom(this.#store.select(schulenLadenVerweigert)),
            filter(([, verweigert]) => !verweigert),
            switchMap(([{ schulkuerzel }]) =>
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
                    const errorContext = mapToErrorContext(action.error, true);
                    this.#messagePublisher.publishError(errorContext.message);
                })
            ),
        { dispatch: false }
    );

    readonly schuldashboardVerlassen$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(SchuleActions.schuldashboardVerlassen),
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

    readonly prepareSchulteilnahmeAnmelden$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchuleActions.prepareSchulteilnahmeAnmelden),
            exhaustMap(({ schulkuerzel }) => {
                const dialogRef = this.#dialog.open<AuswertungsartDialogResult>(AuswertungsartDialogComponent, {
                    width: '500px',
                    data: {
                        schulkuerzel,
                        auswertungsart: undefined,
                        loesungszettelVorhanden: false,
                    } satisfies AuswertungsartDialogData,
                });

                return dialogRef.closed.pipe(
                    filter((result): result is AuswertungsartDialogResult => result !== undefined),
                    map(result =>
                        schulteilnahmeAnmelden({
                            schulkuerzel: result.schulkuerzel,
                            auswertungsart: result.gewaehlteAuswertungsart,
                        })
                    )
                );
            })
        )
    );
}
