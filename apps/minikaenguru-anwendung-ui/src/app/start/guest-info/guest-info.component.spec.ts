import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestInfoComponent } from './guest-info.component';
import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { anonymousUser } from '@matheportal/auth-model';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../../core/wettbewerb/model/wettbewerb.model';
import { WettbewerbFacade } from '../../core/wettbewerb/api/wettbewerb.facade';
import { By } from '@angular/platform-browser';

describe('GuestInfoComponent', () => {
    const wettbewerb: Wettbewerb = {
        beginn: '01.01.2026',
        ende: '31.07.2026',
        freischaltungPrivat: '15.06.2026',
        freischaltungSchulen: '14.03.2026',
        jahr: 2026,
        status: WETTBEWERBSSTATUS.anmeldung,
    };

    let component: GuestInfoComponent;
    let fixture: ComponentFixture<GuestInfoComponent>;

    let aktuellerWettbewerbSignal: WritableSignal<Wettbewerb>;
    let loggedInSignal: WritableSignal<boolean>;

    let wettbewerbFacadeMock: {
        aktuellerWettbewerb: Signal<Wettbewerb>;
    };

    let authSessionFacadeMock: {
        isLoggedIn: Signal<boolean>;
    };

    beforeEach(async () => {
        aktuellerWettbewerbSignal = signal(wettbewerb);
        loggedInSignal = signal(false);

        wettbewerbFacadeMock = {
            aktuellerWettbewerb: aktuellerWettbewerbSignal,
        };

        authSessionFacadeMock = {
            isLoggedIn: loggedInSignal,
        };

        await TestBed.configureTestingModule({
            imports: [GuestInfoComponent],
            providers: [
                {
                    provide: AuthSessionFacade,
                    useValue: authSessionFacadeMock,
                },
                {
                    provide: WettbewerbFacade,
                    useValue: wettbewerbFacadeMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GuestInfoComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('wettbewerb geladen', () => {
        it('should show the Wettbewerbsjahr', () => {
            const titleDe = fixture.debugElement.query(By.css('[data-testid="wettbewerbsjahr"]'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Aktuelles Wettbewerbsjahr: 2026');
        });
        it('should show the termine', () => {
            const beginnDe = fixture.debugElement.query(By.css('[data-testid="beginn"]'));
            expect(beginnDe.nativeElement.textContent.trim()).toBe('01.01.2026');

            const freischaltungSchuleDe = fixture.debugElement.query(By.css('[data-testid="freischaltung-schulen"]'));
            expect(freischaltungSchuleDe.nativeElement.textContent.trim()).toBe('14.03.2026');

            const freischaltungPrivatDe = fixture.debugElement.query(By.css('[data-testid="freischaltung-privat"]'));
            expect(freischaltungPrivatDe.nativeElement.textContent.trim()).toBe('15.06.2026');

            const endeDe = fixture.debugElement.query(By.css('[data-testid="ende"]'));
            expect(endeDe.nativeElement.textContent.trim()).toBe('31.07.2026');
        });
        it('should not show the termine when Wettbewerb beendet', async () => {
            const updatedWettbewerb: Wettbewerb = {
                ...wettbewerb,
                status: WETTBEWERBSSTATUS.beendet,
            };

            aktuellerWettbewerbSignal.set(updatedWettbewerb);
            await fixture.whenStable();

            const termineDe = fixture.debugElement.query(By.css('.mka-guest-info__dates'));
            expect(termineDe).toBeFalsy();

            const beendetTextDe = fixture.debugElement.query(By.css('[data-testid="wettbewerb-beendet-text"]'));
            expect(beendetTextDe.nativeElement.textContent.trim()).toBe('Der diesjährige Wettbewerb ist beendet.');
        });
    });

    describe('loggedIn / loggedOut', () => {
        it('should show Hinweis when not logged in', () => {
            const logInHintDe = fixture.debugElement.query(By.css('.mka-guest-info__login-hint'));
            expect(logInHintDe).toBeTruthy();
        });
        it('should not show Hinweis when logged in', async () => {
            loggedInSignal.set(true);
            await fixture.whenStable();

            const logInHintDe = fixture.debugElement.query(By.css('.mka-guest-info__login-hint'));
            expect(logInHintDe).toBeFalsy();
        });
    });
});
