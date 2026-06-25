import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { mkaAuthorizationFeature } from '../authorization-data/+state/mka-authorization.reducer';
import { MkaAuthorizationEffects } from '../authorization-data';
import { MkaAuthorizationHttpService } from '../authorization-data/mka-authorization-http.service';

export const mkaAuthorizationDataProvider = [
    MkaAuthorizationHttpService,
    provideState(mkaAuthorizationFeature),
    provideEffects(MkaAuthorizationEffects),
];
