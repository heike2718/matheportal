import { Injectable, signal } from '@angular/core';
import { AppMessage, resolveMessageDismissAfterMs } from './feedback.model';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    readonly message = signal<AppMessage | null>(null);

    publishInfo(text: string): void {
        const dismissAfterMs = resolveMessageDismissAfterMs(text);
        this.#publish({ type: 'info', text, dismissAfterMs });
    }

    publishWarning(text: string): void {
        this.#publish({ type: 'warn', text });
    }

    publishError(text: string): void {
        this.#publish({ type: 'error', text });
    }

    clearMessage(): void {
        this.message.set(null);
    }

    #publish(msg: AppMessage): void {
        this.message.set(msg);

        if (msg.type === 'info' && msg.dismissAfterMs) {
            window.setTimeout(() => {
                // Nur löschen, wenn noch dieselbe Message angezeigt wird
                if (this.message() === msg) {
                    this.clearMessage();
                }
            }, msg.dismissAfterMs);
        }
    }
}
