import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { PrivatpersonFacade } from './privatperson.facade';
import { privatpersonFeature } from '../data/+state/privatperson.reducer';
import { PrivatpersonEffects } from '../data/+state/privatperson.effects';

export const privatpersonDataProvider = [
    PrivatpersonFacade,
    provideState(privatpersonFeature),
    provideEffects(PrivatpersonEffects),
];
