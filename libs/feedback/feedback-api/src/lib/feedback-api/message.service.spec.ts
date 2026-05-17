import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {
    let service: MessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MessageService],
        });
        service = TestBed.inject(MessageService);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.clearAllMocks();
        service.clearMessage();
    });

    describe('info', () => {
        it('should set info message with default dismiss timeout', () => {
            // arrange
            const text = 'Test info message';

            // act
            service.publishInfo(text);

            // assert
            const message = service.message();
            expect(message).not.toBeNull();
            expect(message?.type).toBe('info');
            expect(message?.text).toBe(text);
            expect(message?.dismissAfterMs).toBe(3000);
        });

        it('should set info message with custom dismiss timeout', () => {
            // arrange
            const text = 'Test info message';
            const customTimeout = 2000;

            // act
            service.publishInfo(text, customTimeout);

            // assert
            const message = service.message();
            expect(message?.dismissAfterMs).toBe(customTimeout);
        });

        it('should auto-clear info message after dismiss timeout', () => {
            // arrange
            const text = 'Test info message';

            // act
            service.publishInfo(text, 4000);

            // assert before timeout
            expect(service.message()).not.toBeNull();

            // Zeit vorrücken
            vi.advanceTimersByTime(4000);

            // assert after timeout
            expect(service.message()).toBeNull();
        });

        it('should not auto-clear if message was changed before timeout', () => {
            // arrange
            const firstText = 'First message';
            const secondText = 'Second message';

            // act
            service.publishInfo(firstText, 4000);
            const firstMessage = service.message();

            // Message ändern bevor Timeout abläuft
            vi.advanceTimersByTime(2000);
            service.publishInfo(secondText, 4000);

            // Timeout der ersten Message ablaufen lassen
            vi.advanceTimersByTime(2000); // Jetzt bei 4000ms total

            // assert
            expect(service.message()).not.toBeNull();
            expect(service.message()?.text).toBe(secondText);
            expect(service.message()).not.toBe(firstMessage);
        });
    });

    describe('warn', () => {
        it('should set warn message without auto-dismiss', () => {
            // arrange
            const text = 'Test warning message';

            // act
            service.publishWarning(text);

            // assert
            const message = service.message();
            expect(message?.type).toBe('warn');
            expect(message?.text).toBe(text);
            expect(message?.dismissAfterMs).toBeUndefined();

            // Kein Timeout sollte gesetzt sein
            vi.advanceTimersByTime(10000);
            expect(service.message()).not.toBeNull();
        });
    });

    describe('error', () => {
        it('should set error message without auto-dismiss', () => {
            // arrange
            const text = 'Test error message';

            // act
            service.publishError(text);

            // assert
            const message = service.message();
            expect(message?.type).toBe('error');
            expect(message?.text).toBe(text);
            expect(message?.dismissAfterMs).toBeUndefined();

            // Kein Timeout sollte gesetzt sein
            vi.advanceTimersByTime(10000);
            expect(service.message()).not.toBeNull();
        });
    });

    describe('clear', () => {
        it('should clear current message', () => {
            // arrange
            service.publishInfo('Test message');
            expect(service.message()).not.toBeNull();

            // act
            service.clearMessage();

            // assert
            expect(service.message()).toBeNull();
        });

        it('should not throw when clearing already cleared message', () => {
            // act & assert
            expect(() => service.clearMessage()).not.toThrow();
        });
    });

    describe('message signal', () => {
        it('should initially be null', () => {
            expect(service.message()).toBeNull();
        });

        it('should update when message changes', () => {
            // act & assert
            service.publishInfo('First message');
            expect(service.message()?.text).toBe('First message');

            service.publishWarning('Second message');
            expect(service.message()?.text).toBe('Second message');

            service.clearMessage();
            expect(service.message()).toBeNull();

            service.publishError('Third message');
            expect(service.message()?.text).toBe('Third message');
        });
    });

    describe('edge cases', () => {
        it('should handle multiple rapid calls correctly', () => {
            // arrange
            vi.spyOn(window, 'setTimeout');

            // act
            service.publishInfo('Message 1', 1000);
            service.publishInfo('Message 2', 2000);
            service.publishWarning('Message 3');
            service.publishInfo('Message 4', 3000);

            // assert
            expect(service.message()?.text).toBe('Message 4');
            // Timeouts sollten gesetzt worden sein
            expect(setTimeout).toHaveBeenCalledTimes(3);
        });

        it('should not auto-dismiss warn messages', () => {
            // arrange
            service.publishWarning('Warning message');

            // act
            vi.advanceTimersByTime(60000);

            // assert
            expect(service.message()).not.toBeNull();
            expect(service.message()?.type).toBe('warn');
        });

        it('should not auto-dismiss error messages', () => {
            // arrange
            service.publishError('Error message');

            // act
            vi.advanceTimersByTime(60000);

            // assert
            expect(service.message()).not.toBeNull();
            expect(service.message()?.type).toBe('error');
        });

        it('should not clear new message when old timeout fires', () => {
            // Dieser Test stellt sicher, dass wenn:
            // 1. Message A gesetzt wird mit Auto-Dismiss
            // 2. Message B gesetzt wird, bevor A's Timeout abläuft
            // 3. Dann A's Timeout abläuft
            // → Message B sollte NICHT gelöscht werden

            // arrange
            service.publishInfo('Message A', 1000);

            // 500ms später wechseln wir zu Message B
            vi.advanceTimersByTime(500);
            service.publishWarning('Message B'); // Kein Auto-Dismiss

            // act - Jetzt läuft der Timeout von Message A ab
            vi.advanceTimersByTime(500);

            // assert - Message B sollte noch da sein
            expect(service.message()?.text).toBe('Message B');
            expect(service.message()?.type).toBe('warn');
        });

        it('should clear message when timeout fires and no new message was set', () => {
            // Wenn keine neue Message gesetzt wurde, sollte die alte gelöscht werden

            // arrange
            service.publishInfo('Standalone message', 1000);

            // act - Timeout komplett ablaufen lassen
            vi.advanceTimersByTime(1000);

            // assert - Message sollte gelöscht sein
            expect(service.message()).toBeNull();
        });
    });
});
