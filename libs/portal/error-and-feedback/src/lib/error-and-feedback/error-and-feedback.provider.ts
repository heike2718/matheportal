import { Provider, inject } from '@angular/core';
import { MESSAGE_PUBLISHER, MessagePublisher } from '@matheportal/error-handling-api';
import { MessageService } from '@matheportal/feedback-api';

export const errorAndFeedbackProvider: Provider = {
    provide: MESSAGE_PUBLISHER,
    useFactory: (): MessagePublisher => {
        const messageService = inject(MessageService);
        return {
            publishInfo: (message: string): void => {
                messageService.publishInfo(message);
            },
            publishWarning: (message: string): void => {
                messageService.publishWarning(message);
            },
            publishError: (message: string): void => {
                messageService.publishError(message);
            },
        };
    },
};
