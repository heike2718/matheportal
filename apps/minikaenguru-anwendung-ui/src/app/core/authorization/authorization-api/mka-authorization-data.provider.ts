import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { mkaAuthorizationFeature } from '../authorization-data/+state/mka-authorization.reducer';
import { MkaAuthorizationEffects } from '../authorization-data';

export const mkaAuthorizationDataProvider = [
    provideState(mkaAuthorizationFeature),
    provideEffects(MkaAuthorizationEffects),
];
