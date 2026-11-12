import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuswertungsartDialogComponent } from './auswertungsart-dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AuswertungsartDialogData } from '../../../teilnahme/model/teilnahme.model';

describe('AuswertungsartDialogComponent', () => {
    let component: AuswertungsartDialogComponent;
    let fixture: ComponentFixture<AuswertungsartDialogComponent>;

    const dialogRefMock = {
        close: vi.fn(),
    };

    const data: AuswertungsartDialogData = {
        auswertungsart: undefined,
        klassenVorhanden: false,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AuswertungsartDialogComponent],
            providers: [
                {
                    provide: DIALOG_DATA,
                    useValue: data,
                },
                {
                    provide: DialogRef,
                    useValue: dialogRefMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AuswertungsartDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
