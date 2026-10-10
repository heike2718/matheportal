import { provideEffects } from '@ngrx/effects';
import { MinikaenguruEinstiegEffects } from './minikaenguru-einstieg.effects';

export const ablaufsteuerungDataProvider = [provideEffects(MinikaenguruEinstiegEffects)];
