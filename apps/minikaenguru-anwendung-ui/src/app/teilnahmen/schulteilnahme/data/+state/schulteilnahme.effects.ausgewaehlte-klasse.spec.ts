import { Action } from '@ngrx/store';
import { createSchulteilnahmeEffectsTestdaten } from './schulteilnahme.effects.testdaten';
import { setupSchulteilnahmeEffectsTest } from './schulteilnahme.effects.testsetup';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { firstValueFrom } from 'rxjs';
import { getEffectsMetadata } from '@ngrx/effects';

describe('SchulteilnahmeEffects: ausgewählte Klasse', () => {
    let context: ReturnType<typeof setupSchulteilnahmeEffectsTest>;

    const { klassen } = createSchulteilnahmeEffectsTestdaten();

    beforeEach(() => {
        context = setupSchulteilnahmeEffectsTest();
    });

    describe('navigateOnKlasseAusgewaehlt$', () => {
        it('should be configured not to dispatch actions', () => {
            const metadata = getEffectsMetadata(context.effects);

            expect(metadata.navigateOnKlasseAusgewaehlt$?.dispatch).toBe(false);
        });

        it('should navigate to klasse on klasseAusgewaehlt', async () => {
            const { action$, effects, routerMock } = context;

            const promise = firstValueFrom(effects.navigateOnKlasseAusgewaehlt$);

            action$.next(SchulteilnahmeActions.klasseAusgewaehlt({ klasse: klassen[0] }));

            await promise;

            expect(routerMock.navigate).toHaveBeenCalledOnce();
            expect(routerMock.navigate).toHaveBeenCalledWith([
                '/',
                'minikaenguru-anwendung',
                'lehrperson',
                'schule',
                'S1234567',
                'teilnahme',
                'klasse',
                'abcdef',
            ]);
        });
    });
});
