import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { TeilnahmeFacade } from './teilnahme.facade';
import { teilnahmeFeature } from '../data/+state/teilnahme.reducer';
import { TeilnahmeEffects } from '../data/+state/teilnahme.effects';
import { TeilnahmeHttpService } from '../data/teilnahme-http.service';

export const teilnahmeDataProvider = [
    TeilnahmeFacade,
    TeilnahmeHttpService,
    provideState(teilnahmeFeature),
    provideEffects(TeilnahmeEffects),
];
