import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
import { mockRuntimeConfig } from '@matheportal/shared-testing';
import { MATHEPORTAL_SHELL_CONFIGURATION } from './config/matheportal-shell.configuration';
import { AuthFlowFacade } from '@matheportal/auth-api';

describe('AppComponent', () => {
    const activatedRouteStub: Partial<ActivatedRoute> = {};
    const authFlowFacadeMock = {
        login: vi.fn(),
        initClearOrRestoreSession: vi.fn(),
        handleSessionExpired: vi.fn(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                {
                    provide: MATHEPORTAL_SHELL_CONFIGURATION,
                    useValue: { ...mockRuntimeConfig, apiUrl: '' },
                },
                { provide: ActivatedRoute, useFactory: () => activatedRouteStub },
                { provide: AuthFlowFacade, useValue: authFlowFacadeMock },
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
