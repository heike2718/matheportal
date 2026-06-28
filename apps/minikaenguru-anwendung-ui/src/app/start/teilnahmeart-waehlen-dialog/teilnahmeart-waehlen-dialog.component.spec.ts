import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeilnahmeartWaehlenDialogComponent } from './teilnahmeart-waehlen-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';

describe('TeilnahmeartWaehlenDialogComponent', () => {
    let component: TeilnahmeartWaehlenDialogComponent;
    let fixture: ComponentFixture<TeilnahmeartWaehlenDialogComponent>;

    const dialogRefMock = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TeilnahmeartWaehlenDialogComponent],
            providers: [{ provide: DialogRef, useValue: dialogRefMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(TeilnahmeartWaehlenDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
