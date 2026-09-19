import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchuleDialogComponent } from './schule-dialog.component';
import { initialSchuleAnlegenOderAendernRequest, SchuleDialogData } from '../../model/schulkatalog.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

describe('SchuleDialogComponent', () => {
    let component: SchuleDialogComponent;
    let fixture: ComponentFixture<SchuleDialogComponent>;

    const data: SchuleDialogData = {
        ort: {
            land: {
                kuerzel: 'AU',
                name: 'Österreich',
                anzahlOrte: 24,
            },
            kuerzel: 'A1234567',
            name: 'Wien',
            anzahlSchulen: 12,
        },
        payload: initialSchuleAnlegenOderAendernRequest,
    };

    const dialogRefMock = {
        close: vi.fn(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SchuleDialogComponent],
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

        fixture = TestBed.createComponent(SchuleDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
