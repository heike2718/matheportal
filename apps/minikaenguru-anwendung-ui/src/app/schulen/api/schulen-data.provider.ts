import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { schulenFeature } from '../data/+state/schulen.reducer';
import { SchulenEffects } from '../data/+state/schulen.effects';

export const schulenDataProvider = [provideState(schulenFeature), provideEffects(SchulenEffects)];
