import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { WettbewerbHttpService } from '../data/wettbewerb-http.service';
import { wettbewerbFeature } from '../data/+state/wettbewerb.reducer';
import { WettbewerbEffects } from '../data/+state/wettbewerb.effects';

export const wettbewerbDataProvider = [
    WettbewerbHttpService,
    provideState(wettbewerbFeature),
    provideEffects(WettbewerbEffects),
];
