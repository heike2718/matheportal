import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuswertungsartDialogComponent } from './auswertungsart-dialog.component';

describe('AuswertungsartDialogComponent', () => {
    let component: AuswertungsartDialogComponent;
    let fixture: ComponentFixture<AuswertungsartDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AuswertungsartDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AuswertungsartDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
