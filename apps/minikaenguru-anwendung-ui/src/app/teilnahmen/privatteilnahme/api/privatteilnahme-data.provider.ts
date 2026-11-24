import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { PrivatteilnahmeFacade } from './privatteilnahme.facade';
import { PrivatteilnahmeHttpService } from '../data/privatteilnahme-http.service';
import { privatteilnahmeFeature } from '../data/+state/privatteilnahme.reducer';
import { PrivatteilnahmeEffects } from '../data/+state/privatteilnahme.effects';

export const privatteilnahmeDataProvider = [
    PrivatteilnahmeFacade,
    PrivatteilnahmeHttpService,
    provideState(privatteilnahmeFeature),
    provideEffects(PrivatteilnahmeEffects),
];
