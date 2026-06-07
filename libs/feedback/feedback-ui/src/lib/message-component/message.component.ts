import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageService, MessageType } from '@matheportal/feedback-api';

@Component({
    selector: 'mp-message',
    imports: [],
    templateUrl: './message.component.html',
    styleUrl: './message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
    messageService = inject(MessageService);

    readonly #icons: Record<MessageType, string> = {
        info: 'ℹ️',
        warn: '⚠️',
        error: '⛔',
    };

    protected messageClasses(type: MessageType): string {
        return `message ${this.#messageModifierClass(type)}`;
    }

    #messageModifierClass(type: MessageType): string {
        return `message--${type}`;
    }

    protected messageIcon(type: MessageType): string {
        return this.#icons[type];
    }
}
