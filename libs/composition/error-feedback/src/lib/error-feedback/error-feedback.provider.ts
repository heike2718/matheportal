import { Provider, inject } from '@angular/core';
import { ERROR_PUBLISHER, ErrorPublisher } from '@matheportal/error-handling-api';
import { MessageService } from '@matheportal/feedback-api';

export const errorFeedbackProvider: Provider = {
    provide: ERROR_PUBLISHER,
    useFactory: (): ErrorPublisher => {
        const messageService = inject(MessageService);
        return {
            publishWarning: (message: string): void => {
                messageService.publishWarning(message);
            },
            publishError: (message: string): void => {
                messageService.publishError(message);
            },
        };
    },
};
