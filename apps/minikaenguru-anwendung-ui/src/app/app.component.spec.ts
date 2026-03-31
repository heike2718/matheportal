import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NxWelcome } from './nx-welcome';

describe('App', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent, NxWelcome],
        }).compileComponents();
    });

    it('should render title', async () => {
        const fixture = TestBed.createComponent(AppComponent);
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h1')?.textContent).toContain('Welcome minikaenguru-anwendung-ui');
    });
});
