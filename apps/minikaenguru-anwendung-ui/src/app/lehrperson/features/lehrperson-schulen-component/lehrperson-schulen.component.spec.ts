import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LehrpersonSchulenComponent } from './lehrperson-schulen.component';

describe('LehrpersonSchulenComponent', () => {
    let component: LehrpersonSchulenComponent;
    let fixture: ComponentFixture<LehrpersonSchulenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LehrpersonSchulenComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LehrpersonSchulenComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
