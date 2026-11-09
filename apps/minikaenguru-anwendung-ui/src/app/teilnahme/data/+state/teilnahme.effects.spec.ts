import { Action, Store } from '@ngrx/store';
import { firstValueFrom, Subject } from 'rxjs';
import { TeilnahmeEffects } from './teilnahme.effects';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { TeilnahmeHttpService } from '../teilnahme-http.service';
import { TeilnahmeActions } from './teilnahme.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectTeilnahmeLoadState } from './teilnahme.selectors';

describe('TeilnahmeEffects', () => {
    let action$: Subject<Action>;
    let effects: TeilnahmeEffects;
    let store: MockStore;

    const expectedErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    let httpServiceMock: {
        loadAktuellePrivatteilnahme: ReturnType<typeof vi.fn>;
    };

    let messagePublisherMock: { publishError: ReturnType<typeof vi.fn> };

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/teilnahme',
    });

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        httpServiceMock = {
            loadAktuellePrivatteilnahme: vi.fn(),
        };

        messagePublisherMock = {
            publishError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                TeilnahmeEffects,
                provideMockStore(),
                provideMockActions(() => action$),
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
                {
                    provide: TeilnahmeHttpService,
                    useValue: httpServiceMock,
                },
            ],
        });

        effects = TestBed.inject(TeilnahmeEffects);
        store = TestBed.inject(Store) as MockStore;
    });

    describe('ensurePrivatteilnahmeLoaded$', () => {
        it.each(['not-loaded', 'technical-error'] as const)(
            'should map to privatteilnahmeLaden when loadState %s',
            async loadState => {
                store.overrideSelector(selectTeilnahmeLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensurePrivatteilnahmeLoaded$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(TeilnahmeActions.ensurePrivatteilnahmeLoaded());

                    expect(emittedActions).toEqual([TeilnahmeActions.privatteilnahmeLaden()]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );

        it.each(['loaded', 'unauthorized'] as const)(
            'should not map to privatteilnahmeLaden when loadState %s',
            async loadState => {
                store.overrideSelector(selectTeilnahmeLoadState, loadState);
                store.refreshState();

                const emittedActions: Action[] = [];

                const subscription = effects.ensurePrivatteilnahmeLoaded$.subscribe({
                    next: action => emittedActions.push(action),
                });

                try {
                    action$.next(TeilnahmeActions.ensurePrivatteilnahmeLoaded());

                    expect(emittedActions).toEqual([]);
                } finally {
                    subscription.unsubscribe();
                }
            }
        );
    });
});
