import { provideEffects } from '@ngrx/effects';
import { SchulkatalogsucheHttpService } from '../data/schulkatalogsuche-http.service';
import { SchulkatalogsucheFacade } from './schulkatalogsuche.facade';
import { SchulkatalogsucheEffects } from '../data/+state/schulkatalogsuche.effects';
import { provideState } from '@ngrx/store';
import { schulkatalogsucheFeature } from '../data/+state/schulkatalogsuche.reducer';

export const mkaSchulkatalogsucheDataProvider = [
    SchulkatalogsucheFacade,
    SchulkatalogsucheHttpService,
    provideState(schulkatalogsucheFeature),
    provideEffects(SchulkatalogsucheEffects),
];
