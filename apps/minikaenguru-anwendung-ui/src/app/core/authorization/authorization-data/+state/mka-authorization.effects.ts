import { inject, Injectable } from '@angular/core';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MkaAuthorizationHttpService } from '../mka-authorization-http.service';
import { MkaAuthorizationActions } from './mka-authorization.actions';
import { catchError, exhaustMap, filter, map, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { User } from '@matheportal/auth-model';
import { TECHNISCHER_FEHLER_FEHLERMELDUNG } from '@matheportal/shared-model';
import { Store } from '@ngrx/store';
import { fromMkaAuthorization } from './mka-authorization.selectors';
import { AuthSessionFacade, sessionState } from '@matheportal/auth-api';
import { MinikaenguruEinstiegActions } from '../../../ablaufsteuerung/minikaenguru-einstieg.actions';
import { MkaAuthorizationFacade } from '../../authorization-api/mka-authorization.facade';
import { Router } from '@angular/router';
import { MINIKAENGURU_BERECHTIGUNGSTYP } from '../../authorization-model';
import { portalRoutes } from '@matheportal/portal-navigation';

@Injectable()
export class MkaAuthorizationEffects {
    #actions = inject(Actions);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #httpService = inject(MkaAuthorizationHttpService);
    #store = inject(Store);
    #authSessionFacade = inject(AuthSessionFacade);
    #mkaAuthorizationFacade = inject(MkaAuthorizationFacade);
    #router = inject(Router);

    readonly rootEinstiegRequested$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(MinikaenguruEinstiegActions.rootEinstiegRequested),
                switchMap(() =>
                    this.#mkaAuthorizationFacade.authorizationLoadState$.pipe(
                        filter(loadState => loadState !== 'not-loaded'),
                        take(1),
                        filter(loadState => loadState === 'loaded'),
                        withLatestFrom(this.#mkaAuthorizationFacade.berechtigungstyp$),
                        tap(([, berechtigungstyp]) => {
                            switch (berechtigungstyp) {
                                case MINIKAENGURU_BERECHTIGUNGSTYP.none: {
                                    this.#router.navigate([
                                        '/',
                                        portalRoutes.minikaenguruAnwendung.root,
                                        portalRoutes.minikaenguruAnwendung.durchfuehrungsart,
                                    ]);
                                    break;
                                }
                                case MINIKAENGURU_BERECHTIGUNGSTYP.privat: {
                                    this.#router.navigate([
                                        '/',
                                        portalRoutes.minikaenguruAnwendung.root,
                                        portalRoutes.minikaenguruAnwendung.privatperson,
                                    ]);
                                    break;
                                }
                                case MINIKAENGURU_BERECHTIGUNGSTYP.schule: {
                                    this.#router.navigate([
                                        '/',
                                        portalRoutes.minikaenguruAnwendung.root,
                                        portalRoutes.minikaenguruAnwendung.lehrperson,
                                    ]);
                                    break;
                                }
                            }
                        })
                    )
                )
            );
        },
        { dispatch: false }
    );

    readonly ensureAuthorizationOnRootEinstiegRequested$ = createEffect(() =>
        this.#actions.pipe(
            ofType(MinikaenguruEinstiegActions.rootEinstiegRequested),
            map(() => MkaAuthorizationActions.ensureMkaAuthorizationLoaded())
        )
    );

    readonly ensureMkaAuthorizationLoaded$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(MkaAuthorizationActions.ensureMkaAuthorizationLoaded),
            exhaustMap(() =>
                this.#store.select(sessionState).pipe(
                    filter(loadState => loadState !== 'not-loaded'),
                    take(1),
                    filter(loadState => loadState === 'loaded'),
                    map(() => MkaAuthorizationActions.loadMkaAuthorization())
                )
            )
        );
    });

    readonly loadMkaAuthorization$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(MkaAuthorizationActions.loadMkaAuthorization),
            withLatestFrom(this.#store.select(fromMkaAuthorization.authorizationLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded'),
            exhaustMap(() =>
                this.#httpService.loadMkaAuthorization().pipe(
                    map((user: User) => MkaAuthorizationActions.mkaAuthorizationLoaded({ user })),
                    catchError(() => of(MkaAuthorizationActions.loadMkaAuthorizationFailed()))
                )
            )
        );
    });

    readonly mkaAuthorizationLoaded$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(MkaAuthorizationActions.mkaAuthorizationLoaded),
                tap(({ user }) => {
                    this.#authSessionFacade.synchronizeUser(user);
                })
            ),
        { dispatch: false }
    );

    readonly loadMkaAuthorizationFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(MkaAuthorizationActions.loadMkaAuthorizationFailed),
                tap(() => {
                    this.#messagePublisher.publishError(TECHNISCHER_FEHLER_FEHLERMELDUNG);
                })
            ),
        { dispatch: false }
    );
}
