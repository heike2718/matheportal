import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { schulenFeature } from '../data/+state/schulen.reducer';
import { SchulenEffects } from '../data/+state/schulen.effects';
import { SchuleFacade } from './schule.facade';

export const schulenDataProvider = [SchuleFacade, provideState(schulenFeature), provideEffects(SchulenEffects)];
