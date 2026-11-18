import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { mapToErrorContext } from '@matheportal/shared-utils';
import { Store } from '@ngrx/store';
import { SchulteilnahmeHttpService } from '../schulteilnahme-http.service';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { selectAnmeldendePersonLoadState, selectTeilnahme, selectTeilnahmeLoadState } from './schulteilnahme.selectors';
import { Person, Teilnahme } from '../../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { lehrpersonBerechtigungVerweigert } from '../../../../lehrperson/api/lehrperson-store.events';
import { selectSchuleWettbewerbskontext } from '../../../../schule/api/public-schule.selectors';

@Injectable()
export class SchulteilnahmeEffects {
    #actions = inject(Actions);
    #httpService = inject(SchulteilnahmeHttpService);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #store = inject(Store);

    readonly ensureSchulteilnahmeLoaded$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.ensureSchulteilnahmeLoaded),
            withLatestFrom(this.#store.select(selectTeilnahme), this.#store.select(selectTeilnahmeLoadState)),
            filter(([{ schulkuerzel }, teilnahme, loadState]) => {
                const andereSchule = teilnahme !== undefined && teilnahme.kuerzel !== schulkuerzel;
                const needsLoad = loadState === 'not-loaded' || loadState === 'technical-error';
                return andereSchule || needsLoad;
            }),
            map(([{ schulkuerzel }]) => SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel }))
        )
    );

    readonly schulteilnahmeLaden$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(SchulteilnahmeActions.schulteilnahmeLaden),
            switchMap(({ schulkuerzel }) =>
                this.#httpService.loadAktuelleSchulteilnahme(schulkuerzel).pipe(
                    map((teilnahme: Teilnahme) =>
                        SchulteilnahmeActions.teilnahmeGeladen({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) => of(SchulteilnahmeActions.teilnahmeLadenFailed({ error })))
                )
            )
        );
    });

    readonly teilnahmeAngemeldetOrGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.teilnahmeAngemeldet, SchulteilnahmeActions.teilnahmeGeladen),
            map(action => ({
                schulkuerzel: action.teilnahme.kuerzel,
                durchfuehrungsart: action.teilnahme.durchfuehrungsart,
            })),
            filter(({ durchfuehrungsart }) => durchfuehrungsart === DURCHFUEHRUNGSART.schule),
            map(({ schulkuerzel }) => SchulteilnahmeActions.ensureAnmeldendePersonGeladen({ schulkuerzel }))
        )
    );

    readonly teilnahmeLadenFailed$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.teilnahmeLadenFailed),
            map(action => ({ errorContext: mapToErrorContext(action.error, true) })),
            tap(({ errorContext }) => {
                if (errorContext.httpStatus !== 404) {
                    this.#messagePublisher.publishError(errorContext.message);
                } else {
                    this.#messagePublisher.publishWarning(
                        'Die Schule ist noch nicht zum aktuellen Wettbewerb angemeldet.'
                    );
                }
            }),
            map(() => lehrpersonBerechtigungVerweigert())
        )
    );

    readonly ensureAnmeldendePersonGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.ensureAnmeldendePersonGeladen),
            withLatestFrom(this.#store.select(selectAnmeldendePersonLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(([{ schulkuerzel }]) => SchulteilnahmeActions.anmeldendePersonLaden({ schulkuerzel }))
        )
    );

    readonly anmeldendePersonLaden$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.anmeldendePersonLaden),
            switchMap(({ schulkuerzel }) =>
                this.#httpService.loadAnmeldendePerson(schulkuerzel).pipe(
                    map((person: Person) =>
                        SchulteilnahmeActions.anmeldendePersonGeladen({
                            person,
                        })
                    ),
                    catchError((error: Error) => of(SchulteilnahmeActions.anmeldendePersonLadenFailed({ error })))
                )
            )
        )
    );

    readonly schulteilnahmeAnmelden$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.schulteilnahmeAnmelden),
            exhaustMap(({ schulkuerzel, auswertungsart }) =>
                this.#httpService.schuleAnmelden(schulkuerzel, auswertungsart).pipe(
                    withLatestFrom(this.#store.select(selectSchuleWettbewerbskontext)),
                    filter(
                        ([teilnahme, wettbewerbskontext]) => teilnahme.kuerzel === wettbewerbskontext?.schule.kuerzel
                    ),
                    map(([teilnahme]) =>
                        SchulteilnahmeActions.teilnahmeAngemeldet({
                            teilnahme,
                        })
                    ),
                    catchError((error: Error) => of(SchulteilnahmeActions.teilnahmeAnmeldenFailed({ error })))
                )
            )
        )
    );

    readonly teilnahmeAnmeldenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(SchulteilnahmeActions.teilnahmeAnmeldenFailed),
                tap(action => {
                    const errorContext = mapToErrorContext(action.error, false);
                    this.#messagePublisher.publishError(errorContext.message);
                })
            ),
        { dispatch: false }
    );
}
