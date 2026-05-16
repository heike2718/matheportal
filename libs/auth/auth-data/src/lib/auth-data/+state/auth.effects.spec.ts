import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of, throwError, firstValueFrom, take } from 'rxjs';
import { AuthEffects } from './auth.effects';

describe('AuthEffects', () => {
    let action$: ReplaySubject<unknown>;
    let effects: AuthEffects;

    const httpServiceMock = {
        getLoginUrl: vi.fn(),
    };
});
