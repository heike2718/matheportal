import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
import { mockRuntimeConfig } from '@matheportal/shared-testing';
import { MATHEPORTAL_SHELL_CONFIGURATION } from './config/matheportal-shell.configuration';
import { AuthFlowFacade, AuthSessionFacade } from '@matheportal/auth-api';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

describe('AppComponent', () => {
    const activatedRouteStub: Partial<ActivatedRoute> = {};
    const authFlowFacadeMock = {
        initClearOrRestoreSession: vi.fn(),
    };
    const authSessionFacadeMock = {
        hasSession$: of(false),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideMockStore(),
                {
                    provide: MATHEPORTAL_SHELL_CONFIGURATION,
                    useValue: { ...mockRuntimeConfig, apiUrl: '' },
                },
                { provide: ActivatedRoute, useFactory: () => activatedRouteStub },
                { provide: AuthFlowFacade, useValue: authFlowFacadeMock },
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
            ],
        }).compileComponents();
    });

    it('should render the router-outlet', async () => {
        const fixture = TestBed.createComponent(AppComponent);
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });
});
