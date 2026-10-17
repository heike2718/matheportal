import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ArbeitskontextHttpService } from '../../../core/services/arbeitskontext-http.service';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { LehrpersonActions } from './lehrperson.actions';
import { selectSchulenLoadState } from './lehrperson.selectors';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { portalRoutes } from '@matheportal/portal-navigation';
import { mapToErrorContext } from '@matheportal/shared-utils';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';

@Injectable()
export class LehrpersonEffects {
    #actions = inject(Actions);
    #httpService = inject(ArbeitskontextHttpService);
    #store = inject(Store);
    #router = inject(Router);
    #messagePublisher = inject(MESSAGE_PUBLISHER);

    readonly ensureSchulenGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(LehrpersonActions.ensureSchulenGeladen),
            withLatestFrom(this.#store.select(selectSchulenLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(() => LehrpersonActions.schulenLaden())
        )
    );

    readonly schulenLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(LehrpersonActions.schulenLaden),
            switchMap(() =>
                this.#httpService.loadLehrpersonSchulen().pipe(
                    map(schulen => LehrpersonActions.schulenGeladen({ schulen })),
                    catchError((error: Error) => of(LehrpersonActions.schulenLadenFailed({ error })))
                )
            )
        );
    });

    readonly schulenGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(LehrpersonActions.schulenGeladen),
            filter(({ schulen }) => schulen.length === 1),
            filter(() => this.istAufEinstiegsseite()),
            map(({ schulen }) =>
                LehrpersonActions.wettbewerbsorganisationGestartet({
                    schulkuerzel: schulen[0].kuerzel,
                })
            )
        )
    );

    readonly schulenLadenFailed$ = createEffect(() =>
        this.#actions.pipe(
            ofType(LehrpersonActions.schulenLadenFailed),
            map(({ error }) => {
                const errorContext = mapToErrorContext(error);

                if (errorContext.httpStatus === 403) {
                    return LehrpersonActions.berechtigungVerweigert();
                }

                return LehrpersonActions.actionFailed({
                    errorMessage: errorContext.message,
                });
            })
        )
    );

    readonly actionFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(LehrpersonActions.actionFailed),
                tap(action => {
                    this.#messagePublisher.publishError(action.errorMessage);
                })
            ),
        { dispatch: false }
    );

    readonly wettbewerbsorganisationGestartet$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(LehrpersonActions.wettbewerbsorganisationGestartet),
                tap(action => {
                    // void ignoriert das Promise vom router. Dann hängt es nicht blöd in der Gegend herum.
                    void this.#router.navigate([
                        '/',
                        portalRoutes.minikaenguruAnwendung.root,
                        portalRoutes.minikaenguruAnwendung.lehrperson,
                        'schule',
                        action.schulkuerzel,
                    ]);
                })
            ),
        { dispatch: false }
    );

    private istAufEinstiegsseite(): boolean {
        const navigation = this.#router.currentNavigation();
        const url = navigation?.finalUrl ?? navigation?.extractedUrl ?? this.#router.parseUrl(this.#router.url);

        const segments = url.root.children[PRIMARY_OUTLET]?.segments.map(segment => segment.path) ?? [];

        const routes = portalRoutes.minikaenguruAnwendung;

        return (
            segments[0] === routes.root &&
            (segments.length === 1 || (segments.length === 2 && segments[1] === routes.lehrperson))
        );
    }
}
