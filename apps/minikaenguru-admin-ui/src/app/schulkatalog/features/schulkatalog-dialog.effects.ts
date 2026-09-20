import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { schulkatalogActions } from '../data/+state/schulkatalog.actions';
import { filter, map, exhaustMap, EMPTY } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { Dialog } from '@angular/cdk/dialog';
import {
    initialLandMitOrtUndSchuleAnlegenRequest,
    initialOrtMitSchuleAnlegenRequest,
    initialSchuleAnlegenOderAendernRequest,
    LandMitOrtUndSchuleAnlegenRequest,
    OrtMitSchuleAnlegenDialogData,
    OrtMitSchuleAnlegenRequest,
    SchuleDialogData,
    SchuleAnlegenOderAendernRequest,
} from '../model/schulkatalog.model';
import { LandMitOrtUndSchuleAnlegenDialogComponent } from './land-mit-ort-und-schule-anlegen-dialog-component/land-mit-ort-und-schule-anlegen-dialog.component';
import { Store } from '@ngrx/store';
import { fromSchulkatalog } from '../data/+state/schulkatalog.selectors';
import { OrtMitSchuleAnlegenDialogComponent } from './ort-mit-schule-anlegen-dialog-component/ort-mit-schule-anlegen-dialog.component';
import { SchuleDialogComponent } from './schule-dialog-component/schule-dialog.component';

@Injectable()
export class SchulkatalogDialogEffects {
    #actions = inject(Actions);
    #dialog = inject(Dialog);
    #store = inject(Store);

    readonly landMitOrtUndSchuleAnlegenSelected$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.landMitOrtUndSchuleAnlegenSelected),
            exhaustMap(() => {
                const dialogRef = this.#dialog.open<LandMitOrtUndSchuleAnlegenRequest>(
                    LandMitOrtUndSchuleAnlegenDialogComponent,
                    {
                        width: '500px',
                        data: initialLandMitOrtUndSchuleAnlegenRequest,
                    }
                );

                return dialogRef.closed.pipe(
                    filter((result): result is LandMitOrtUndSchuleAnlegenRequest => result !== undefined),
                    map(result =>
                        schulkatalogActions.landMitOrtUndSchuleAnlegen({
                            payload: result,
                        })
                    )
                );
            })
        )
    );

    readonly ortMitSchuleAnlegenSelected$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.ortMitSchuleAnlegenSelected),
            concatLatestFrom(() => this.#store.select(fromSchulkatalog.selectSelectedLand)),
            exhaustMap(([, selectedLand]) => {
                if (!selectedLand) {
                    return EMPTY;
                }

                const dialogRef = this.#dialog.open<OrtMitSchuleAnlegenRequest>(OrtMitSchuleAnlegenDialogComponent, {
                    width: '500px',
                    data: {
                        land: selectedLand,
                        payload: initialOrtMitSchuleAnlegenRequest,
                    } satisfies OrtMitSchuleAnlegenDialogData,
                });

                return dialogRef.closed.pipe(
                    filter((result): result is OrtMitSchuleAnlegenRequest => result !== undefined),
                    map(payload =>
                        schulkatalogActions.ortMitSchuleAnlegen({
                            land: selectedLand,
                            payload,
                        })
                    )
                );
            })
        )
    );

    readonly schuleAnlegenSelected$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.schuleAnlegenSelected),
            concatLatestFrom(() => this.#store.select(fromSchulkatalog.selectSelectedOrt)),
            exhaustMap(([, selectedOrt]) => {
                if (!selectedOrt) {
                    return EMPTY;
                }

                const dialogRef = this.#dialog.open<SchuleAnlegenOderAendernRequest>(SchuleDialogComponent, {
                    width: '500px',
                    data: {
                        ort: selectedOrt,
                        payload: initialSchuleAnlegenOderAendernRequest,
                        submitButtonLabel: 'anlegen',
                    } satisfies SchuleDialogData,
                });

                return dialogRef.closed.pipe(
                    filter((result): result is SchuleAnlegenOderAendernRequest => result !== undefined),
                    map(payload =>
                        schulkatalogActions.schuleAnlegen({
                            ort: selectedOrt,
                            payload,
                        })
                    )
                );
            })
        )
    );

    readonly schuleUmbenennenSelected$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.schuleUmbenennenSelected),
            concatLatestFrom(() => this.#store.select(fromSchulkatalog.selectSelectedSchule)),
            exhaustMap(([, selectedSchule]) => {
                if (!selectedSchule) {
                    return EMPTY;
                }

                const dialogRef = this.#dialog.open<SchuleAnlegenOderAendernRequest>(SchuleDialogComponent, {
                    width: '500px',
                    data: {
                        ort: selectedSchule.ort,
                        payload: { emailAuftraggeber: '', name: selectedSchule.name },
                        submitButtonLabel: 'umbenennen',
                    } satisfies SchuleDialogData,
                });

                return dialogRef.closed.pipe(
                    filter((result): result is SchuleAnlegenOderAendernRequest => result !== undefined),
                    map(payload =>
                        schulkatalogActions.schuleUmbenennen({
                            schule: selectedSchule,
                            payload,
                        })
                    )
                );
            })
        )
    );
}
