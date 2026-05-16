import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthEffects, authFeature } from '@matheportal/auth-data';

export const authDataProvider = [provideState(authFeature), provideEffects(AuthEffects)];
