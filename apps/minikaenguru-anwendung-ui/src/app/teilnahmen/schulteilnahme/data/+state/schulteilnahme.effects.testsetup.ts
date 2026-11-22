import { vi } from 'vitest';
import { Action, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SchulteilnahmeEffects } from './schulteilnahme.effects';
import { SchulteilnahmeHttpService } from '../schulteilnahme-http.service';
import { DefaultUrlSerializer, Navigation, Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { KlasseDialogResult } from '../../model/klasse.model';

export function setupSchulteilnahmeEffectsTest() {
    vi.resetAllMocks();

    const urlSerializer = new DefaultUrlSerializer();

    const action$ = new Subject<Action>();

    const httpServiceMock = {
        loadAktuelleSchulteilnahme: vi.fn(),
        schuleAnmelden: vi.fn(),
        loadAnmeldendePerson: vi.fn(),
        loadKlassen: vi.fn(),
        klasseAnlegen: vi.fn(),
    };

    const messagePublisherMock = {
        publishWarning: vi.fn(),
        publishError: vi.fn(),
    };

    const routerMock = {
        navigate: vi.fn(),
        currentNavigation: vi.fn<() => Pick<Navigation, 'extractedUrl' | 'finalUrl'> | null>(),
        parseUrl: vi.fn((url: string) => urlSerializer.parse(url)),
        url: '/minikaenguru-anwendung',
    };

    routerMock.currentNavigation.mockReturnValue(null);
    routerMock.parseUrl.mockImplementation(url => urlSerializer.parse(url));
    routerMock.url = '/minikaenguru-anwendung';

    const dialogMock = {
        open: vi.fn(),
    };

    const closed$: Subject<KlasseDialogResult | undefined> = new Subject<KlasseDialogResult | undefined>();

    TestBed.configureTestingModule({
        providers: [
            SchulteilnahmeEffects,
            provideMockStore(),
            provideMockActions(() => action$),
            {
                provide: MESSAGE_PUBLISHER,
                useValue: messagePublisherMock,
            },
            {
                provide: SchulteilnahmeHttpService,
                useValue: httpServiceMock,
            },
            {
                provide: Router,
                useValue: routerMock,
            },

            {
                provide: Dialog,
                useValue: dialogMock,
            },
        ],
    });

    const effects = TestBed.inject(SchulteilnahmeEffects);
    const store = TestBed.inject(Store) as MockStore;

    vi.clearAllMocks();

    dialogMock.open.mockReturnValue({
        closed: closed$,
    });

    return { action$, effects, store, httpServiceMock, messagePublisherMock, routerMock, dialogMock, closed$ };
}
