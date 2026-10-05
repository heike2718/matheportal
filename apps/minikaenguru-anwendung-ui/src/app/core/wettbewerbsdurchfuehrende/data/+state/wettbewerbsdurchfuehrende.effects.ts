import { inject, Injectable } from '@angular/core';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { WettbewerbsdurchfuehrendeHttpService } from '../wettbewerbsdurchfuehrende-http.service';
import { WettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { catchError, exhaustMap, filter, map, of, tap } from 'rxjs';
import { DURCHFUEHRUNGSART, Wettbewerbsdurchfuehrender } from '../../model/wettbewerbsdurchfuehrende.model';
import { portalRoutes } from '@matheportal/portal-navigation';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { schuleSelected } from '../../../../schulkatalog/schulkatalogsuche/api/schulkatalogsuche.events';
import { mapErrorToMessage } from '@matheportal/shared-utils';
import { mkaAuthorizationLoaded } from '../../../authorization/authorization-api/mka-authorization-store.events';
import { hasBerechtigungFuerMinikaenguru } from '../wettbewerbsdurchfuehrende-data.utils';

@Injectable()
export class WettbewerbsdurchfuehrendeEffects {
    #actions = inject(Actions);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #httpService = inject(WettbewerbsdurchfuehrendeHttpService);
    #router = inject(Router);
    #authSessionFacade = inject(AuthSessionFacade);

    readonly durchfuehrungsartPrivatGewaehlt$ = createEffect(() =>
        this.#actions.pipe(
            ofType(WettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt),
            map(() =>
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: {
                        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                        schulkuerzel: undefined,
                    },
                })
            )
        )
    );

    readonly durchfuehrungsartSchuleGewaelt$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(WettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt),
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

    readonly schuleSelected$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(schuleSelected),
            map(({ schule }) =>
                WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({
                    requestDto: { durchfuehrungsart: DURCHFUEHRUNGSART.schule, schulkuerzel: schule.kuerzel },
                })
            )
        );
    });

    readonly durchfuehrendenAnlegen$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen),
            exhaustMap(({ requestDto }) =>
                this.#httpService.createWettbewerbsdurchfuehrenden(requestDto).pipe(
                    map((responseDto: Wettbewerbsdurchfuehrender) =>
                        WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({
                            wettbewerbsdurchfuehrender: responseDto,
                        })
                    ),
                    catchError((error: Error) =>
                        of(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error }))
                    )
                )
            )
        );
    });

    readonly durchfuehrendenAnlegenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisher.publishError(errorMessage);
                })
            ),
        { dispatch: false }
    );

    readonly durchfuehrenderAngelegt$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt),
                tap(({ wettbewerbsdurchfuehrender: responseDto }) => {
                    switch (responseDto.durchfuehrungsart) {
                        case 'PRIVAT':
                            void this.#router.navigate([
                                '/',
                                portalRoutes.minikaenguruAnwendung.root,
                                portalRoutes.minikaenguruAnwendung.privatperson,
                            ]);
                            this.#authSessionFacade.validateSession();
                            break;
                        case 'SCHULE':
                            void this.#router.navigate([
                                '/',
                                portalRoutes.minikaenguruAnwendung.root,
                                portalRoutes.minikaenguruAnwendung.lehrperson,
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

    readonly loadWettbewerbsdurchfuehrendenOnAuthorizationLoaded$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(mkaAuthorizationLoaded),
            filter(({ user }) => hasBerechtigungFuerMinikaenguru(user)),
            map(() => WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden())
        );
    });

    readonly durchfuehrendenLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden),
            exhaustMap(() =>
                this.#httpService.loadWettbewerbsdurchfuehrenden().pipe(
                    map((responseDto: Wettbewerbsdurchfuehrender) =>
                        WettbewerbsdurchfuehrendeActions.durchfuehrenderGeladen({
                            wettbewerbsdurchfuehrender: responseDto,
                        })
                    ),
                    catchError((error: Error) =>
                        of(WettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed({ error }))
                    )
                )
            )
        );
    });
}
