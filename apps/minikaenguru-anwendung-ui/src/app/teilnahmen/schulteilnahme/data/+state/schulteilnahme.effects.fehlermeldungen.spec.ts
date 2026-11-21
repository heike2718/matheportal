import { Action } from '@ngrx/store';
import { getEffectsMetadata } from '@ngrx/effects';
import { firstValueFrom } from 'rxjs';
import { lehrpersonBerechtigungVerweigert } from '../../../../lehrperson/api/lehrperson-store.events';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { setupSchulteilnahmeEffectsTest } from './schulteilnahme.effects.testsetup';
import { createSchulteilnahmeEffectsTestdaten } from './schulteilnahme.effects.testdaten';

describe('SchulteilnahmeEffects: Fehlermeldungen', () => {
    let context: ReturnType<typeof setupSchulteilnahmeEffectsTest>;

    const { notFoundResponse, forbiddenResponse, httpServerErrorResponse } = createSchulteilnahmeEffectsTestdaten();

    beforeEach(() => {
        context = setupSchulteilnahmeEffectsTest();
    });

    describe('teilnahmeLadenFailed$', () => {
        it('should be configured to dispatch actions', () => {
            const metadata = getEffectsMetadata(context.effects);

            expect(metadata.teilnahmeLadenFailed$?.dispatch).toBe(true);
        });

        it('should show a warning and emit lehrpersonBerechtigungVerweigert when http-status is 404', () => {
            const { action$, effects, messagePublisherMock } = context;

            const emittedActions: Action[] = [];
            const subscription = effects.teilnahmeLadenFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.teilnahmeLadenFailed({ error: notFoundResponse }));

                expect(messagePublisherMock.publishWarning).toHaveBeenCalledOnce();
                expect(messagePublisherMock.publishWarning).toHaveBeenCalledWith(
                    'Die Schule ist noch nicht zum aktuellen Wettbewerb angemeldet.'
                );
                expect(messagePublisherMock.publishError).not.toHaveBeenCalled();

                expect(emittedActions).toEqual([lehrpersonBerechtigungVerweigert()]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should show an error and emit lehrpersonBerechtigungVerweigert when http-status is 403', () => {
            const { action$, effects, messagePublisherMock } = context;

            const emittedActions: Action[] = [];
            const subscription = effects.teilnahmeLadenFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.teilnahmeLadenFailed({ error: forbiddenResponse }));

                expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
                expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                    'Sie haben leider keine Berechtigung für diese Aktion.'
                );
                expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();

                expect(emittedActions).toEqual([lehrpersonBerechtigungVerweigert()]);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should show an error and emit lehrpersonBerechtigungVerweigert when http-status is 500', () => {
            const { action$, effects, messagePublisherMock } = context;

            const emittedActions: Action[] = [];
            const subscription = effects.teilnahmeLadenFailed$.subscribe(action => {
                emittedActions.push(action);
            });

            try {
                action$.next(SchulteilnahmeActions.teilnahmeLadenFailed({ error: httpServerErrorResponse }));

                expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
                expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                    'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
                );
                expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();

                expect(emittedActions).toEqual([lehrpersonBerechtigungVerweigert()]);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('teilnahmeAnmeldenFailed$', () => {
        it('should be configured not to dispatch actions', () => {
            const metadata = getEffectsMetadata(context.effects);

            expect(metadata.teilnahmeAnmeldenFailed$?.dispatch).toBe(false);
        });

        it('should show an error when http-status is 404', async () => {
            const { action$, effects, messagePublisherMock } = context;

            const promise = firstValueFrom(effects.teilnahmeAnmeldenFailed$);

            action$.next(
                SchulteilnahmeActions.teilnahmeAnmeldenFailed({
                    error: notFoundResponse,
                })
            );

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
            );

            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
        });

        it('should show an error when http-status is 500', async () => {
            const { action$, effects, messagePublisherMock } = context;

            const promise = firstValueFrom(effects.teilnahmeAnmeldenFailed$);

            action$.next(
                SchulteilnahmeActions.teilnahmeAnmeldenFailed({
                    error: httpServerErrorResponse,
                })
            );

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.'
            );

            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
        });
    });
});
