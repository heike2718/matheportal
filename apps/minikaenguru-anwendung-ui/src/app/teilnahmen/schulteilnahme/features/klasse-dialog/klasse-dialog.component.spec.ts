import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KlasseDialogComponent } from './klasse-dialog.component';

describe('KlasseDialogComponent', () => {
    let component: KlasseDialogComponent;
    let fixture: ComponentFixture<KlasseDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KlasseDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(KlasseDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
