import { HttpErrorResponse } from '@angular/common/http';
import { SCHULKATALOG_LOADING_STATE } from '../model/schulkatalog.model';

export type SCHULKATALOG_LOAD_ERROR_STATE = 'unauthorized' | 'technical' | 'not-found';

export function mapErrorToSchulkatalogLoadingState(error: HttpErrorResponse): SCHULKATALOG_LOADING_STATE {
    switch (error.status) {
        case 401:
        case 403:
            return 'unauthorized';
        case 404:
            return 'not-found';
        default:
            return 'technical-error';
    }
}
