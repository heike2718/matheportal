import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef } from '@angular/cdk/dialog';
import { DurchfuehrungsartWaehlenDialogComponent } from './durchfuehrungsart-waehlen-dialog.component';

describe('DurchfuehrungsartWaehlenDialogComponent', () => {
    let component: DurchfuehrungsartWaehlenDialogComponent;
    let fixture: ComponentFixture<DurchfuehrungsartWaehlenDialogComponent>;

    const dialogRefMock = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DurchfuehrungsartWaehlenDialogComponent],
            providers: [{ provide: DialogRef, useValue: dialogRefMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(DurchfuehrungsartWaehlenDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
