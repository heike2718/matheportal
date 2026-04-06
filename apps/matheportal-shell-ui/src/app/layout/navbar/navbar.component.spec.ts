import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AppComponent } from '../../app.component';
import { RouterModule, ActivatedRoute } from '@angular/router';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let activatedRouteStub: Partial<ActivatedRoute> = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarComponent,
                AppComponent,
                RouterModule.forRoot([{ path: '', component: AppComponent }]),
            ],
            providers: [
                { provide: ActivatedRoute, useFactory: () => activatedRouteStub },
            ]

        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
