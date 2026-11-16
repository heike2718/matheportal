import { inject, Injectable } from '@angular/core';
import { TeilnahmeHttpService } from '../teilnahme-http.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TeilnahmeActions } from './teilnahme.actions';
import { catchError, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Person, Teilnahme } from '../../model/teilnahme.model';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { mapToErrorContext } from '@matheportal/shared-utils';
import { Store } from '@ngrx/store';
import { selectAnmeldendePersonLoadState, selectTeilnahmeLoadState } from './teilnahme.selectors';
import { DURCHFUEHRUNGSART } from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { lehrpersonBerechtigungVerweigert } from '../../../lehrperson/api/lehrperson-store.events';

@Injectable()
export class TeilnahmeEffects {
    #actions = inject(Actions);
    #httpService = inject(TeilnahmeHttpService);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #store = inject(Store);

    readonly ensurePrivatteilnahmeLoaded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(TeilnahmeActions.ensurePrivatteilnahmeLoaded),
            withLatestFrom(this.#store.select(selectTeilnahmeLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(() => TeilnahmeActions.privatteilnahmeLaden())
        )
    );

    readonly privatteilnahmeLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(TeilnahmeActions.privatteilnahmeLaden),
            switchMap(() =>
                this.#httpService.loadAktuellePrivatteilnahme().pipe(
                    map((teilnahme: Teilnahme) =>
                        TeilnahmeActions.teilnahmeGeladen({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) =>
                        of(
                            TeilnahmeActions.teilnahmeLadenFailed({
                                durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                                error,
                            })
                        )
                    )
                )
            )
        );
    });

    readonly ensureSchulteilnahmeLoaded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(TeilnahmeActions.ensureSchulteilnahmeLoaded),
            withLatestFrom(this.#store.select(selectTeilnahmeLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(([{ schulkuerzel }]) => TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel: schulkuerzel }))
        )
    );

    readonly schulteilnahmeLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(TeilnahmeActions.schulteilnahmeLaden),
            switchMap(({ schulkuerzel }) =>
                this.#httpService.loadAktuelleSchulteilnahme(schulkuerzel).pipe(
                    map((teilnahme: Teilnahme) =>
                        TeilnahmeActions.teilnahmeGeladen({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) =>
                        of(
                            TeilnahmeActions.teilnahmeLadenFailed({
                                durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                                error,
                            })
                        )
                    )
                )
            )
        );
    });

    readonly teilnahmeGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(TeilnahmeActions.teilnahmeGeladen),
            map(action => ({
                schulkuerzel: action.teilnahme.kuerzel,
                durchfuehrungsart: action.teilnahme.durchfuehrungsart,
            })),
            filter(({ durchfuehrungsart }) => durchfuehrungsart === DURCHFUEHRUNGSART.schule),
            map(({ schulkuerzel }) => TeilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel }))
        )
    );

    readonly teilnahmeLadenFailed$ = createEffect(() =>
        this.#actions.pipe(
            ofType(TeilnahmeActions.teilnahmeLadenFailed),
            map(action => ({
                durchfuehrungsart: action.durchfuehrungsart,
                errorContext: mapToErrorContext(action.error, true),
            })),
            tap(({ durchfuehrungsart, errorContext }) => {
                if (errorContext.httpStatus !== 404) {
                    this.#messagePublisher.publishError(errorContext.message);
                } else {
                    if (durchfuehrungsart === DURCHFUEHRUNGSART.privat) {
                        this.#messagePublisher.publishWarning(
                            'Sie sind noch nicht zum aktuellen Wettbewerb angemeldet.'
                        );
                    } else {
                        this.#messagePublisher.publishWarning(
                            'Die Schule ist noch nicht zum aktuellen Wettbewerb angemeldet.'
                        );
                    }
                }
            }),
            filter(
                ({ durchfuehrungsart, errorContext }) =>
                    durchfuehrungsart === DURCHFUEHRUNGSART.schule && errorContext.httpStatus === 403
            ),
            map(() => lehrpersonBerechtigungVerweigert())
        )
    );

    readonly ensureAnmeldendePersonGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(TeilnahmeActions.ensureAnmeldendePersonGeladen),
            withLatestFrom(this.#store.select(selectAnmeldendePersonLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(([{ schulkuerzel }]) => TeilnahmeActions.anmeldendePersonLaden({ schulkuerzel }))
        )
    );

    readonly anmeldendePersonLaden$ = createEffect(() =>
        this.#actions.pipe(
            ofType(TeilnahmeActions.anmeldendePersonLaden),
            switchMap(({ schulkuerzel }) =>
                this.#httpService.loadAnmeldendePerson(schulkuerzel).pipe(
                    map((person: Person) =>
                        TeilnahmeActions.anmeldendePersonGeladen({
                            person,
                        })
                    ),
                    catchError((error: Error) => of(TeilnahmeActions.anmeldendePersonLadenFailed({ error })))
                )
            )
        )
    );

    readonly privatteilnahmeAnmelden$ = createEffect(() =>
        this.#actions.pipe(
            ofType(TeilnahmeActions.privatteilnahmeAnmelden),
            exhaustMap(() =>
                this.#httpService.privatAnmelden().pipe(
                    map((teilnahme: Teilnahme) =>
                        TeilnahmeActions.teilnahmeAngemeldet({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) => of(TeilnahmeActions.teilnahmeAnmeldenFailed({ error })))
                )
            )
        )
    );

    readonly schulteilnahmeAnmelden$ = createEffect(() =>
        this.#actions.pipe(
            ofType(TeilnahmeActions.schulteilnahmeAnmelden),
            exhaustMap(({ schulkuerzel, auswertungsart }) =>
                this.#httpService.schuleAnmelden(schulkuerzel, auswertungsart).pipe(
                    map((teilnahme: Teilnahme) =>
                        TeilnahmeActions.teilnahmeAngemeldet({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) => of(TeilnahmeActions.teilnahmeAnmeldenFailed({ error })))
                )
            )
        )
    );

    readonly teilnahmeAnmeldenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(TeilnahmeActions.teilnahmeAnmeldenFailed),
                tap(action => {
                    const errorContext = mapToErrorContext(action.error, false);
                    this.#messagePublisher.publishError(errorContext.message);
                })
            ),
        { dispatch: false }
    );
}
