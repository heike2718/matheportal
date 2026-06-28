import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestInfoComponent } from './guest-info.component';
import { computed } from '@angular/core';
import { anonymousUser } from '@matheportal/auth-model';
import { AuthSessionFacade } from '@matheportal/auth-api';

describe('GuestInfoComponent', () => {
    let component: GuestInfoComponent;
    let fixture: ComponentFixture<GuestInfoComponent>;

    const authSessionFacadeMock = {
        user: computed(() => anonymousUser),
        isLoggedIn: computed(() => false),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GuestInfoComponent],
            providers: [
                {
                    provide: AuthSessionFacade,
                    useValue: authSessionFacadeMock,
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
});
