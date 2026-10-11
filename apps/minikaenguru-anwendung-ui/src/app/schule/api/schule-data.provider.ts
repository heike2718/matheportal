import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { schulenFeature } from '../data/+state/schule.reducer';
import { SchulenEffects } from '../data/+state/schule.effects';
import { SchuleFacade } from './schule.facade';

export const schuleDataProvider = [SchuleFacade, provideState(schulenFeature), provideEffects(SchulenEffects)];
