import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { WettbewerbsdurchfuehrendeFacade } from './wettbewerbsdurchfuehrende.facade';
import { WettbewerbsdurchfuehrendeHttpService } from '../data/wettbewerbsdurchfuehrende-http.service';
import { wettbewerbsdurchfuehrendeFeature } from '../data/+state/wettbewerbsdurchfuehrende.reducer';
import { WettbewerbsdurchfuehrendeEffects } from '../data/+state/wettbewerbsdurchfuehrende.effects';

export const wettbewerbsdurchfuehrendeDataProvider = [
    WettbewerbsdurchfuehrendeFacade,
    WettbewerbsdurchfuehrendeHttpService,
    provideState(wettbewerbsdurchfuehrendeFeature),
    provideEffects(WettbewerbsdurchfuehrendeEffects),
];
