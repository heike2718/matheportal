import { provideState } from '@ngrx/store';
import { SchulkatalogHttpService } from '../data/schulkatalog-http.service';
import { SchulkatalogFacade } from './schulkatalog.facade';
import { schulkatalogFeature } from '../data/+state/schulkatalog.reducer';
import { provideEffects } from '@ngrx/effects';
import { SchulkatalogEffects } from '../data/+state/schulkatalog.effects';

export const schulkatalogDataProvider = [
    SchulkatalogFacade,
    SchulkatalogHttpService,
    provideState(schulkatalogFeature),
    provideEffects(SchulkatalogEffects),
];
