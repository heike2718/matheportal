import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { mapToErrorContext } from '@matheportal/shared-utils';
import { Store } from '@ngrx/store';
import { SchulteilnahmeHttpService } from '../schulteilnahme-http.service';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import {
    selectAnmeldendePersonLoadState,
    selectKlassenLoadState,
    selectTeilnahme,
    selectTeilnahmeLoadState,
} from './schulteilnahme.selectors';
import { Person, Teilnahme } from '../../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { lehrpersonBerechtigungVerweigert } from '../../../../lehrperson/api/lehrperson-store.events';
import { selectSchuleWettbewerbskontext } from '../../../../schule/api/public-schule.selectors';
import { Klasse, KlasseDialogData, KlasseDialogResult, KlasseRequest } from '../../model/klasse.model';
import { Router } from '@angular/router';
import { portalRoutes } from '@matheportal/portal-navigation';
import { Dialog } from '@angular/cdk/dialog';
import { KlasseDialogComponent } from '../../features/klasse-dialog/klasse-dialog.component';
import { ErrorContext } from '@matheportal/shared-model';

@Injectable()
export class SchulteilnahmeEffects {
    #actions = inject(Actions);
    #httpService = inject(SchulteilnahmeHttpService);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #router = inject(Router);
    #store = inject(Store);
    #dialog = inject(Dialog);

    readonly ensureSchulteilnahmeGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.ensureSchulteilnahmeGeladen),
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

    readonly ensureAnmeldendePersonGeladenOnTeilnahmeAngemeldetOrGeladen$ = createEffect(() =>
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

    readonly ensureKlassenGeladenOnTeilnahmeAngemeldetOrGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.teilnahmeAngemeldet, SchulteilnahmeActions.teilnahmeGeladen),
            map(action => ({
                schulkuerzel: action.teilnahme.kuerzel,
                durchfuehrungsart: action.teilnahme.durchfuehrungsart,
            })),
            filter(({ durchfuehrungsart }) => durchfuehrungsart === DURCHFUEHRUNGSART.schule),
            map(({ schulkuerzel }) => SchulteilnahmeActions.ensureKlassenGeladen({ schulkuerzel }))
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

    readonly ensureKlassenGeladen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.ensureKlassenGeladen),
            withLatestFrom(this.#store.select(selectKlassenLoadState)),
            filter(([, loadState]) => loadState === 'not-loaded' || loadState === 'technical-error'),
            map(([{ schulkuerzel }]) => SchulteilnahmeActions.klassenLaden({ schulkuerzel }))
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
                    catchError((error: Error) =>
                        of(SchulteilnahmeActions.anmeldendePersonLadenFailed({ schulkuerzel, error }))
                    )
                )
            )
        )
    );

    readonly klassenLaden$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.klassenLaden),
            switchMap(({ schulkuerzel }) =>
                this.#httpService.loadKlassen(schulkuerzel).pipe(
                    map((klassen: Klasse[]) =>
                        SchulteilnahmeActions.klassenGeladen({
                            schulkuerzel,
                            klassen,
                        })
                    ),
                    catchError((error: Error) => of(SchulteilnahmeActions.klassenLadenFailed({ schulkuerzel, error })))
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

    readonly navigateOnKlasseAusgewaehlt$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(SchulteilnahmeActions.klasseAusgewaehlt),
                tap(({ klasse }) => {
                    // void ignoriert das Promise vom router. Dann hängt es nicht blöd in der Gegend herum.
                    void this.#router.navigate([
                        '/',
                        portalRoutes.minikaenguruAnwendung.root,
                        portalRoutes.minikaenguruAnwendung.lehrperson,
                        'schule',
                        klasse.schulkuerzel,
                        portalRoutes.minikaenguruAnwendung.schulteilnahme,
                        'klasse',
                        klasse.uuid,
                    ]);
                })
            ),
        { dispatch: false }
    );

    readonly openDialogOnKlasseAnlegenRequested$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.klasseAnlegenRequested),
            exhaustMap(({ schulkuerzel }) => {
                const dialogRef = this.#dialog.open<KlasseDialogResult>(KlasseDialogComponent, {
                    width: '800px',
                    maxWidth: 'calc(100vw - 24px)',
                    maxHeight: 'calc(100dvh - 24px)',
                    data: {
                        schulkuerzel,
                        name: '',
                        submitButtonLabel: 'anlegen',
                    } satisfies KlasseDialogData,
                });

                return dialogRef.closed.pipe(
                    filter((result): result is KlasseDialogResult => result !== undefined),
                    map(result =>
                        SchulteilnahmeActions.klasseAnlegen({
                            schulkuerzel: result.schulkuerzel,
                            klasseRequest: { name: result.name } satisfies KlasseRequest,
                        })
                    )
                );
            })
        )
    );

    readonly klasseAnlegen$ = createEffect(() =>
        this.#actions.pipe(
            ofType(SchulteilnahmeActions.klasseAnlegen),
            exhaustMap(({ schulkuerzel, klasseRequest }) =>
                this.#httpService.klasseAnlegen(schulkuerzel, klasseRequest).pipe(
                    map(klasse => SchulteilnahmeActions.klasseAngelegt({ klasse })),
                    catchError((error: Error) => of(SchulteilnahmeActions.klasseAnlegenFailed({ schulkuerzel, error })))
                )
            )
        )
    );

    readonly klasseAnlegenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(SchulteilnahmeActions.klasseAnlegenFailed),
                tap(({ error }) => {
                    const errorContext: ErrorContext = mapToErrorContext(error, false);
                    if (errorContext.httpStatus === 409 || errorContext.httpStatus === 401) {
                        this.#messagePublisher.publishWarning(errorContext.message);
                    } else {
                        this.#messagePublisher.publishError(errorContext.message);
                    }
                })
            ),
        { dispatch: false }
    );
}
