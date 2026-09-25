import { inject, Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, filter, map } from 'rxjs/operators';
import { schulkatalogantragActions } from '../data/+state/schulkatalogantrag.actions';
import { initialSchulkatalogantrag, Schulkatalogantrag } from '../model/schulkatalogantrag.model';
import { SchulkatalogantragDialogComponent } from './schulkatalogantrag-dialog-component/schulkatalogantrag-dialog.component';
import { schulkatalogsucheActions } from '../../schulkatalogsuche/data/+state/schulkatalogsuche.actions';

@Injectable()
export class SchulkatalogantragDialogEffects {
    #actions = inject(Actions);
    #dialog = inject(Dialog);

    readonly submitSchulkatalogantragRequested$ = createEffect(() =>
        this.#actions.pipe(
            ofType(schulkatalogsucheActions.submitSchulkatalogantragRequested),
            exhaustMap(() => {
                const dialogRef = this.#dialog.open<Schulkatalogantrag>(SchulkatalogantragDialogComponent, {
                    width: '500px',
                    maxWidth: 'calc(100vw - 24px)',
                    maxHeight: 'calc(100dvh - 24px)',
                    data: initialSchulkatalogantrag,
                });

                return dialogRef.closed.pipe(
                    filter((result): result is Schulkatalogantrag => result !== undefined),
                    map(result =>
                        schulkatalogantragActions.submitSchulkatalogantrag({
                            antrag: result,
                        })
                    )
                );
            })
        )
    );
}
