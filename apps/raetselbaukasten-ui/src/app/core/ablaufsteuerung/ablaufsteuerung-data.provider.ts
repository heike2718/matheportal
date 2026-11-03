import { provideEffects } from '@ngrx/effects';
import { RaetselbaukastenEinstiegEffects } from './raetselbaukasten-einstieg.effects';
import { RaetselbaukastenEinstiegFacade } from './raetselbaukasten-einstieg.facade';

export const raetselbaukastenEinstiegDataProvider = [
    provideEffects(RaetselbaukastenEinstiegEffects),
    RaetselbaukastenEinstiegFacade,
];
