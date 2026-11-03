import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { By } from '@angular/platform-browser';
import { computed } from '@angular/core';
import { RESTRICTED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { RaetselbaukastenEinstiegFacade } from '../../core/ablaufsteuerung/raetselbaukasten-einstieg.facade';

describe('StartComponent', () => {
    let fixture: ComponentFixture<StartComponent>;

    const facadeMock = {
        raetselbaukastenAufgerufen: vi.fn(),
    };

    const portalSessionFacadeMock = {
        sessionLoadState: computed(() => 'not-loaded'),
    };

    async function setup(sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE) {
        portalSessionFacadeMock.sessionLoadState = computed(() => sessionLoadState);
        await TestBed.configureTestingModule({
            imports: [StartComponent],
            providers: [
                { provide: RaetselbaukastenEinstiegFacade, useValue: facadeMock },
                { provide: PortalSessionFacade, useValue: portalSessionFacadeMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartComponent);
    }

    beforeEach(async () => {
        vi.clearAllMocks();
        TestBed.resetTestingModule();
    });

    describe('initialization', () => {
        it('should trigger einstiegsaction once on initialization', async () => {
            await setup('loaded');

            fixture.detectChanges();

            expect(facadeMock.raetselbaukastenAufgerufen).toHaveBeenCalledOnce();
        });
    });

    describe('waiting for session', () => {
        beforeEach(async () => {
            await setup('not-loaded');

            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('only shows a waiting text', () => {
            expect(fixture.debugElement.query(By.css('[data-testid="bitte-warten-text"]'))).toBeDefined();
            expect(fixture.debugElement.query(By.css('[data-testid="technical-error-text"]'))).toBeNull();
        });
    });

    describe('technical error', () => {
        beforeEach(async () => {
            await setup('technical-error');

            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('only shows a waiting text', () => {
            expect(fixture.debugElement.query(By.css('[data-testid="bitte-warten-text"]'))).toBeNull();
            expect(fixture.debugElement.query(By.css('[data-testid="technical-error-text"]'))).toBeDefined();
        });
    });
});
