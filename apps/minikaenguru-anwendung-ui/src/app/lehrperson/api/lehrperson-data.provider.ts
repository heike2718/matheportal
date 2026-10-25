import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { LehrpersonFacade } from './lehrperson.facade';
import { lehrpersonFeature } from '../data/+state/lehrperson.reducer';
import { LehrpersonEffects } from '../data/+state/lehrperson.effects';

export const lehrpersonDataProvider = [
    LehrpersonFacade,
    provideState(lehrpersonFeature),
    provideEffects(LehrpersonEffects),
];
