import { provideEffects } from '@ngrx/effects';
import { SchulkatalogantragEffects } from '../data/+state/schulkatalogantrag.effects';
import { SchulkatalogantragHttpService } from '../data/schulkatalogantrag-http.service';
import { SchulkatalogantragDialogEffects } from '../features/schulkatalogantrag-dialog.effects';

export const mkaSchulkatalogantragDataProvider = [
    SchulkatalogantragHttpService,
    provideEffects(SchulkatalogantragEffects, SchulkatalogantragDialogEffects),
];
