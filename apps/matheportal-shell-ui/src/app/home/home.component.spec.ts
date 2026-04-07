import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    const activatedRouteStub: Partial<ActivatedRoute> = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeComponent, RouterModule.forRoot([{ path: '', component: AppComponent }])],
            providers: [{ provide: ActivatedRoute, useFactory: () => activatedRouteStub }],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
