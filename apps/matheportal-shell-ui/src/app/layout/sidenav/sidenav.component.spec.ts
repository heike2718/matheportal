import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidenavComponent } from './sidenav.component';
import { mockRuntimeConfig } from '@matheportal/testing';
import { MATHEPORTAL_SHELL_CONFIGURATION } from '../../config/matheportal-shell.configuration';
import { HomeComponent } from '../../home/home.component';

describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidenavComponent],
            providers: [
                {
                    provide: MATHEPORTAL_SHELL_CONFIGURATION,
                    useValue: { ...mockRuntimeConfig, apiUrl: '' },
                },
                provideRouter([{ path: 'home', component: HomeComponent }]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidenavComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
