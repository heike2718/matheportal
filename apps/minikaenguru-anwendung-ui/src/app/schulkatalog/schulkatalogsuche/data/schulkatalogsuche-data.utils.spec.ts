import { HttpErrorResponse } from '@angular/common/http';
import { SCHULKATALOG_LOADING_STATE } from '../model/schulkatalog.model';
import { mapErrorToSchulkatalogLoadingState } from './schulkatalogsuche-data.utils';

describe('schulkatalogsuche-data.utils', () => {
    describe('mapErrorToSchulkatalogLoadingState', () => {
        it('should return unauthorized when 401', () => {
            const result: SCHULKATALOG_LOADING_STATE = mapErrorToSchulkatalogLoadingState(
                new HttpErrorResponse({
                    status: 401,
                    statusText: 'unauthorized',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );

            expect(result).toBe('unauthorized');
        });
        it('should return unauthorized when 403', () => {
            const result: SCHULKATALOG_LOADING_STATE = mapErrorToSchulkatalogLoadingState(
                new HttpErrorResponse({
                    status: 403,
                    statusText: 'forbidden',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );

            expect(result).toBe('unauthorized');
        });
        it('should return loaded when 404', () => {
            const result: SCHULKATALOG_LOADING_STATE = mapErrorToSchulkatalogLoadingState(
                new HttpErrorResponse({
                    status: 404,
                    statusText: 'not-found',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );

            expect(result).toBe('loaded');
        });
        it('should return technical when 400', () => {
            const result: SCHULKATALOG_LOADING_STATE = mapErrorToSchulkatalogLoadingState(
                new HttpErrorResponse({
                    status: 400,
                    statusText: 'bad request',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );

            expect(result).toBe('technical-error');
        });
        it('should return technical when minimum 500', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 500;
            const result: SCHULKATALOG_LOADING_STATE = mapErrorToSchulkatalogLoadingState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );

            expect(result).toBe('technical-error');
        });
        it('should return technical when not 401, 403, 404', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 404;
            const result: SCHULKATALOG_LOADING_STATE = mapErrorToSchulkatalogLoadingState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );
            expect(result).toBe('technical-error');
        });
        it('should return technical when other Error', () => {
            const error = new Error('uiuiui');
            const result: SCHULKATALOG_LOADING_STATE = mapErrorToSchulkatalogLoadingState(error);

            expect(result).toBe('technical-error');
        });
    });
});
