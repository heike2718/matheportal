import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create and show the title', () => {
        expect(component).toBeTruthy();
        const titleDe = fixture.debugElement.query(By.css('.mk-admin-dashboard__heading'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Administration');
    });

    it.each([['schulkatalog-link', '/minikaenguru-admin/schulkatalog']])(
        'should link %s card to %s',
        (testId, expectedUrl) => {
            const card = fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
            const routerLink = card.injector.get(RouterLink);
            expect(routerLink.urlTree?.toString()).toBe(expectedUrl);
        }
    );

    it.each([['schulkatalog-heading', 'Schulkatalog']])('should card %s show heading %s', (testId, expectedHeading) => {
        const card = fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
        expect(card.nativeElement.textContent.trim()).toBe(expectedHeading);
    });

    it.each([['schulkatalog-content', 'Schulen suchen und den Schulkatalog verwalten']])(
        'should card %s show content %s',
        (testId, expectedContent) => {
            const card = fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
            expect(card.nativeElement.textContent.trim()).toBe(expectedContent);
        }
    );
});
