import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
describe('AppComponent', () => {
    const activatedRouteStub: Partial<ActivatedRoute> = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [{ provide: ActivatedRoute, useFactory: () => activatedRouteStub }],
        }).compileComponents();
    });

    it('should render title', async () => {
        const fixture = TestBed.createComponent(AppComponent);
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h1')?.textContent).toBe('Matheportal');
    });
});
