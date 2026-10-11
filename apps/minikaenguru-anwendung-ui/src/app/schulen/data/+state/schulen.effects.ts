import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { catchError, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { SchuleActions } from './schulen.actions';
import { mapErrorToMessage } from '@matheportal/shared-utils';
import { ArbeitskontextHttpService } from '../../../core/services/arbeitskontext-http.service';
import {
    wettbewerbsorganisationGestartet,
    ensureWettbewerbskontextSchuleGeladen,
    wettbewerbsorganisationVerlassen,
} from '../../../lehrperson/api/lehrperson-store.events';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { portalRoutes } from '@matheportal/portal-navigation';
import { LehrpersonActions } from '../../../lehrperson/data/+state/lehrperson.actions';
import { Store } from '@ngrx/store';
import { selectSchulenLoadState } from './schulen.selectors';

@Injectable()
export class SchulenEffects {
    #actions = inject(Actions);
    #httpService = inject(ArbeitskontextHttpService);
    #router = inject(Router);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #store = inject(Store);

    readonly ensureSchulenGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchuleActions.ensureSchulenGeladen),
            withLatestFrom(this.#store.select(selectSchulenLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(() => SchuleActions.schulenLaden())
        )
    );

    readonly schulenLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(SchuleActions.schulenLaden),
            switchMap(() =>
                this.#httpService.loadLehrpersonSchulen().pipe(
                    map(schulen => SchuleActions.schulenGeladen({ schulen })),
                    catchError((error: Error) => of(SchuleActions.schulenLadenFailed({ error })))
                )
            )
        );
    });

    readonly schulenGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchuleActions.schulenGeladen),
            filter(({ schulen }) => schulen.length === 1),
            filter(() => this.istAufEinstiegsseite()),
            map(({ schulen }) =>
                LehrpersonActions.wettbewerbsorganisationGestartet({
                    schulkuerzel: schulen[0].kuerzel,
                })
            )
        )
    );

    readonly wettbewerbsorganisationGestartet$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(wettbewerbsorganisationGestartet),
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

    readonly ensureWettbewerbskontextGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(ensureWettbewerbskontextSchuleGeladen),
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

    readonly loadActionFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(SchuleActions.schulenLadenFailed, SchuleActions.wettbewerbskontextLadenFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisher.publishError(errorMessage);
                })
            ),
        { dispatch: false }
    );

    readonly wettbewerbsorganisationVerlassen$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(wettbewerbsorganisationVerlassen),
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
