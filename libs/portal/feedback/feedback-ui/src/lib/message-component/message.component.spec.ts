import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageComponent } from './message.component';
import { MessageService } from '@matheportal/feedback-api';
import { signal } from '@angular/core';
import { AppMessage } from '@matheportal/feedback-api';

type MessageServiceMock = Pick<MessageService, 'clearMessage' | 'message'>;

describe('MessageComponent', () => {
    let component: MessageComponent;
    let fixture: ComponentFixture<MessageComponent>;

    const appMessage: AppMessage = {
        type: 'info',
        text: 'irgendeine Info',
        dismissAfterMs: 3000,
    };

    const messageSignal = signal<AppMessage | null>(appMessage);

    const messageServiceMock: MessageServiceMock = {
        clearMessage: vi.fn(),
        message: messageSignal,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MessageComponent],
            providers: [{ provide: MessageService, useValue: messageServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(MessageComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not show message when no message is present', () => {
        messageSignal.set(null);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.message')).toBeFalsy();
    });

    it('should show info message without close button', () => {
        messageSignal.set({ type: 'info', text: 'Info-Test', dismissAfterMs: 10000 });
        fixture.detectChanges();

        const message = fixture.nativeElement.querySelector('.message');

        expect(message).toBeTruthy();
        expect(message.textContent).toContain('Info-Test');
        expect(message.classList).toContain('message--info');
        expect(fixture.nativeElement.querySelector('.message__close')).toBeFalsy();
    });

    it('should call clearMessage when close button is clicked', () => {
        messageSignal.set({ type: 'error', text: 'Fehler-Test' });
        fixture.detectChanges();

        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.message__close');

        button.click();

        expect(messageServiceMock.clearMessage).toHaveBeenCalledOnce();
    });
});
