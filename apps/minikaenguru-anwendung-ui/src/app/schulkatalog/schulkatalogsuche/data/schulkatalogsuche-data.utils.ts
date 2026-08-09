import { HttpErrorResponse } from '@angular/common/http';
import { Ort, SCHULKATALOG_LOADING_STATE } from '../model/schulkatalog.model';

export type SCHULKATALOG_LOAD_ERROR_STATE = 'unauthorized' | 'technical' | 'not-found';

export function mapErrorToSchulkatalogLoadingState(error: Error): SCHULKATALOG_LOADING_STATE {
    if (error.name === 'HttpErrorResponse') {
        const httpError = error as HttpErrorResponse;
        switch (httpError.status) {
            case 401:
            case 403:
                return 'unauthorized';
            case 404:
                return 'loaded';
            default:
                return 'technical-error';
        }
    }
    return 'technical-error';
}

export function normalizeSearchTerm(term: string): string {
    return term.trim();
}

export function isTermSearchable(term: string): boolean {
    const normalizedTerm = normalizeSearchTerm(term);
    return normalizedTerm.length >= 3;
}

export function getBeschreibungSelectedOrt(ort: Ort): string {
    if (ort.name === ort.land.name) {
        return ort.name;
    }

    return ort.name + ' (' + ort.land.name + ')';
}
