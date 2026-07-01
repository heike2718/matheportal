import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { mkaAuthorizationFeature } from '../authorization-data/+state/mka-authorization.reducer';
import { MkaAuthorizationEffects } from '../authorization-data';
import { MkaAuthorizationHttpService } from '../authorization-data/mka-authorization-http.service';
import { MkaAuthorizationFacade } from './mka-authorization.facade';

export const mkaAuthorizationDataProvider = [
    MkaAuthorizationFacade,
    MkaAuthorizationHttpService,
    provideState(mkaAuthorizationFeature),
    provideEffects(MkaAuthorizationEffects),
];
