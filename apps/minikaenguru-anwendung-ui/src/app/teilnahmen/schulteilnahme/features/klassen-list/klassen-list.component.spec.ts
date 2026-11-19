import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KlassenListComponent } from './klassen-list.component';

describe('KlassenListComponent', () => {
    let component: KlassenListComponent;
    let fixture: ComponentFixture<KlassenListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KlassenListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(KlassenListComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
