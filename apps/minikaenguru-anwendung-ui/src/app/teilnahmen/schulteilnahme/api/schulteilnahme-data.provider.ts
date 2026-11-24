import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { SchulteilnahmeFacade } from './schulteilnahme.facade';
import { SchulteilnahmeHttpService } from '../data/schulteilnahme-http.service';
import { schulteilnahmeFeature } from '../data/+state/schulteilnahme.reducer';
import { SchulteilnahmeEffects } from '../data/+state/schulteilnahme.effects';

export const schulteilnahmeDataProvider = [
    SchulteilnahmeFacade,
    SchulteilnahmeHttpService,
    provideState(schulteilnahmeFeature),
    provideEffects(SchulteilnahmeEffects),
];
