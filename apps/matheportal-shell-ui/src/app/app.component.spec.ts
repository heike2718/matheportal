import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
import { mockRuntimeConfig } from '@matheportal/testing';
import { MATHEPORTAL_SHELL_CONFIGURATION } from './config/matheportal-shell.configuration';

describe('AppComponent', () => {
    const activatedRouteStub: Partial<ActivatedRoute> = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                {
                    provide: MATHEPORTAL_SHELL_CONFIGURATION,
                    useValue: { ...mockRuntimeConfig, apiUrl: '' },
                },
                { provide: ActivatedRoute, useFactory: () => activatedRouteStub },
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
