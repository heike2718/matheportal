import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { By } from '@angular/platform-browser';
import { computed, signal } from '@angular/core';
import { VERANSTALTERTYP, Veranstaltertyp } from '../core/context/minikaenguru-context.model';
import { MinikaenguruContextFacade } from '../core/context/minikaenguru-context.facade';

describe('StartComponent', () => {
    let component: StartComponent;
    let fixture: ComponentFixture<StartComponent>;

    const loggedIn = signal(false);
    const veranstaltertyp = signal<Veranstaltertyp>(VERANSTALTERTYP.none);

    const minikaenguruContextFacadeMock = {
        isLoggedIn: computed(() => loggedIn()),
        isPrivatveranstalter: computed(() => veranstaltertyp() === VERANSTALTERTYP.privat),
        isLehrer: computed(() => veranstaltertyp() === VERANSTALTERTYP.lehrer),
        isStandarduser: computed(() => veranstaltertyp() === VERANSTALTERTYP.none),
    };

    beforeEach(async () => {
        loggedIn.set(false);
        veranstaltertyp.set(VERANSTALTERTYP.none);

        await TestBed.configureTestingModule({
            imports: [StartComponent],
            providers: [{ provide: MinikaenguruContextFacade, useValue: minikaenguruContextFacadeMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(StartComponent);
        component = fixture.componentInstance;
    });

    describe('logged out tests', () => {
        it('shows guest-info when not logged in', () => {
            loggedIn.set(false);
            veranstaltertyp.set(VERANSTALTERTYP.none);
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrer'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privat'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeFalsy();
        });
    });

    describe('logged in tests', () => {
        it('shows mka-standarduser when logged in and none', () => {
            loggedIn.set(true);
            veranstaltertyp.set(VERANSTALTERTYP.none);
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrer'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privat'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeTruthy();
        });

        it('shows dashboard-lehrer when logged in and lehrer', () => {
            loggedIn.set(true);
            veranstaltertyp.set(VERANSTALTERTYP.lehrer);
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrer'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privat'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeFalsy();
        });

        it('shows dashboard-privat when logged in and privatveranstalter', () => {
            loggedIn.set(true);
            veranstaltertyp.set(VERANSTALTERTYP.privat);
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('mka-guest-info'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-lehrer'))).toBeFalsy();
            expect(fixture.debugElement.query(By.css('mka-dashboard-privat'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('[data-testid="mka-standarduser"]'))).toBeFalsy();
        });
    });
});
