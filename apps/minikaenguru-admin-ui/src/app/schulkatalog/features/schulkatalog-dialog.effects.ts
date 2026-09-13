import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { schulkatalogActions } from '../data/+state/schulkatalog.actions';
import { filter, map, exhaustMap } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import {
    initialLandMitOrtUndSchuleAnlegenRequest,
    LandMitOrtUndSchuleAnlegenRequest,
} from '../model/schulkatalog.model';
import { LandMitOrtUndSchuleAnlegenDialogComponent } from './land-mit-ort-und-schule-anlegen-dialog-component/land-mit-ort-und-schule-anlegen-dialog.component';

@Injectable()
export class SchulkatalogDialogEffects {
    #actions = inject(Actions);
    #dialog = inject(Dialog);

    readonly landMitOrtUndSchuleAnlegenSelected$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogActions.landMitOrtUndSchuleAnlegenSelected),
            exhaustMap(() => {
                const dialogRef = this.#dialog.open<LandMitOrtUndSchuleAnlegenRequest>(
                    LandMitOrtUndSchuleAnlegenDialogComponent,
                    {
                        width: '400px',
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
}
