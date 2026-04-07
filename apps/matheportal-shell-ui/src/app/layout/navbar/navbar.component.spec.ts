import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockRuntimeConfig } from '@matheportal/shared-testing-ui';
import { NavbarComponent } from './navbar.component';
import { HomeComponent } from '../../home/home.component';
import { MATHEPORTAL_SHELL_CONFIGURATION } from '../../config/matheportal-shell.configuration';
import { Component } from '@angular/core';

describe('NavbarComponent', () => {
    let fixture: ComponentFixture<NavbarComponent>;
    let component: NavbarComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarComponent],
            providers: [
                {
                    provide: MATHEPORTAL_SHELL_CONFIGURATION,
                    useValue: { ...mockRuntimeConfig, apiUrl: '' },
                },
                provideRouter([
                    { path: 'home', component: HomeComponent },
                    { path: 'minikaenguru-anwendung', component: DummyRouteComponent },
                    { path: 'raetselbaukasten', component: DummyRouteComponent },
                ]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        component.isHandset$ = of(false);
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should show hamburger menu button on handset', () => {
        component.isHandset$ = of(true);
        fixture.detectChanges();

        const buttonDe = fixture.debugElement.query(By.css('.nav__menu-btn'));
        expect(buttonDe).toBeTruthy();

        const linksDe = fixture.debugElement.query(By.css('.nav__links'));
        expect(linksDe).toBeNull();
    });

    it('should emit sidenavToggle when hamburger menu button is clicked', () => {
        const spy = vi.spyOn(component.sidenavToggle, 'emit');

        component.isHandset$ = of(true);
        fixture.detectChanges();

        const buttonDe = fixture.debugElement.query(By.css('.nav__menu-btn'));
        expect(buttonDe).toBeTruthy();

        buttonDe.nativeElement.click();

        expect(spy).toHaveBeenCalledOnce();
    });

    it('should show desktop navigation links when not on handset', () => {
        component.isHandset$ = of(false);
        fixture.detectChanges();

        const linksDe = fixture.debugElement.query(By.css('.nav__links'));
        expect(linksDe).toBeTruthy();

        const menuButtonDe = fixture.debugElement.query(By.css('.nav__menu-btn'));
        expect(menuButtonDe).toBeNull();

        const portalLinkDe = fixture.debugElement.query(By.css('.nav__link--portal'));
        const minikaenguruLinkDe = fixture.debugElement.query(By.css('.nav__link--minikaenguru'));
        const raetselbaukastenLinkDe = fixture.debugElement.query(By.css('.nav__link--raetselbaukasten'));

        expect(portalLinkDe).toBeTruthy();
        expect(minikaenguruLinkDe).toBeTruthy();
        expect(raetselbaukastenLinkDe).toBeTruthy();
    });
});

@Component({
    standalone: true,
    template: '',
})
class DummyRouteComponent {}
