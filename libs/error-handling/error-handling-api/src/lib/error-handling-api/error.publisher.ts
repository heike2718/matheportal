import { InjectionToken } from '@angular/core';

export interface MessagePublisher {
    publishInfo(message: string): void;
    publishWarning(message: string): void;
    publishError(message: string): void;
}

export const MESSAGE_PUBLISHER = new InjectionToken<MessagePublisher>('MESSAGE_PUBLISHER');
