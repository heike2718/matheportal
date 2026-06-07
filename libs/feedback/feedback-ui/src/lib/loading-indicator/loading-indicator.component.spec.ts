import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingIndicatorComponent } from './loading-indicator.component';
import { LoadingService } from '@matheportal/feedback-api';
import { signal } from '@angular/core';

type LoadingServiceMock = Pick<LoadingService, 'start' | 'stop' | 'loading'>;

describe('LoadingIndicatorComponent', () => {
    let component: LoadingIndicatorComponent;
    let fixture: ComponentFixture<LoadingIndicatorComponent>;

    const loadingServiceMock: LoadingServiceMock = {
        start: vi.fn(),
        stop: vi.fn(),
        loading: signal(false),
    };

    beforeEach(async () => {
        vi.clearAllMocks();
        loadingServiceMock.loading.set(false);

        await TestBed.configureTestingModule({
            imports: [LoadingIndicatorComponent],
            providers: [{ provide: LoadingService, useValue: loadingServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingIndicatorComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show Overlay when loading', () => {
        loadingServiceMock.loading.set(true);
        fixture.detectChanges();

        const overlay = fixture.nativeElement.querySelector('.loading-indicator');

        expect(overlay).toBeTruthy();
    });

    it('should not show Overlay when not loading', () => {
        loadingServiceMock.loading.set(false);
        fixture.detectChanges();

        const overlay = fixture.nativeElement.querySelector('.loading-indicator');

        expect(overlay).toBeFalsy();
    });
});
