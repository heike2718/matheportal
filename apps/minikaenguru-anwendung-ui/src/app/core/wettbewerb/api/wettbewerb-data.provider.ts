import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { WettbewerbHttpService } from '../data/wettbewerb-http.service';
import { wettbewerbFeature } from '../data/+state/wettbewerb.reducer';
import { WettbewerbEffects } from '../data/+state/wettbewerb.effects';
import { WettbewerbFacade } from './wettbewerb.facade';

export const wettbewerbDataProvider = [
    WettbewerbFacade,
    WettbewerbHttpService,
    provideState(wettbewerbFeature),
    provideEffects(WettbewerbEffects),
];
