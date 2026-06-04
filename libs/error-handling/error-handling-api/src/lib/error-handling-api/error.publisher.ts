import { InjectionToken } from '@angular/core';

export interface ErrorPublisher {
    publishWarning(message: string): void;
    publishError(message: string): void;
}

export const ERROR_PUBLISHER = new InjectionToken<ErrorPublisher>('ERROR_PUBLISHER');
