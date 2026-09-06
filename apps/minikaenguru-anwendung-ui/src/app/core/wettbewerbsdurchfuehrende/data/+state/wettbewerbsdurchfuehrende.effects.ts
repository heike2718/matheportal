import { inject, Injectable } from '@angular/core';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { WettbewerbsdurchfuehrendeHttpService } from '../wettbewerbsdurchfuehrende-http.service';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { DURCHFUEHRUNGSART, Wettbewerbsdurchfuehrender } from '../../model/wettbewerbsdurchfuehrende.model';
import { portalRoutes } from '@matheportal/portal-navigation';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { schuleSelected } from '../../../../schulkatalog/schulkatalogsuche/api/schulkatalogsuche.events';
import { mapErrorToMessage } from '@matheportal/shared-utils';

@Injectable()
export class WettbewerbsdurchfuehrendeEffects {
    #actions = inject(Actions);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #httpService = inject(WettbewerbsdurchfuehrendeHttpService);
    #router = inject(Router);
    #authSessionFacade = inject(AuthSessionFacade);

    durchfuehrungsartPrivatGewaehlt$ = createEffect(() =>
        this.#actions.pipe(
            ofType(wettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt),
            map(() =>
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: {
                        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                        schulkuerzel: undefined,
                    },
                })
            )
        )
    );

    durchfuehrungsartSchuleGewaelt$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(wettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt),
                tap(() => {
                    this.#router.navigate([
                        '/',
                        portalRoutes.minikaenguruAnwendung.root,
                        portalRoutes.minikaenguruAnwendung.schulkatalogsuche,
                    ]);
                })
            ),
        { dispatch: false }
    );

    schuleSelected$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schuleSelected),
            map(({ schule }) =>
                wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: { durchfuehrungsart: DURCHFUEHRUNGSART.schule, schulkuerzel: schule.kuerzel },
                })
            )
        );
    });

    durchfuehrendenAnlegen$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen),
            exhaustMap(({ requestDto }) =>
                this.#httpService.createWettbewerbsdurchfuehrenden(requestDto).pipe(
                    map((responseDto: Wettbewerbsdurchfuehrender) =>
                        wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto })
                    ),
                    catchError((error: Error) =>
                        of(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error }))
                    )
                )
            )
        );
    });

    durchfuehrendenAnlegenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisher.publishError(errorMessage);
                })
            ),
        { dispatch: false }
    );

    durchfuehrenderAngelegt$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt),
                tap(({ responseDto }) => {
                    switch (responseDto.durchfuehrungsart) {
                        case 'PRIVAT':
                            void this.#router.navigate([
                                '/',
                                portalRoutes.minikaenguruAnwendung.root,
                                portalRoutes.minikaenguruAnwendung.dashboardPrivatperson,
                            ]);
                            this.#authSessionFacade.validateSession();
                            break;
                        case 'SCHULE':
                            void this.#router.navigate([
                                '/',
                                portalRoutes.minikaenguruAnwendung.root,
                                portalRoutes.minikaenguruAnwendung.dashboardLehrperson,
                            ]);
                            this.#authSessionFacade.validateSession();
                            break;
                        default:
                            // dieser Fall ist nur möglich, wenn eine weitere DURCHFUEHRUNGSART hinzugefügt wird.
                            throw new Error(
                                `unbekannte DURCHFUEHRUNGSART $responseDto.durchfuehrungsart beim Anlegen eines Durchführenden`
                            );
                    }
                })
            ),
        { dispatch: false }
    );
}
