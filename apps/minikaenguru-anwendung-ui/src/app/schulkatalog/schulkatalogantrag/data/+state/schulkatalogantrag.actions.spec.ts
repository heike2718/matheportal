import { HttpErrorResponse } from '@angular/common/http';
import { Schulkatalogantrag } from '../../model/schulkatalogantrag.model';
import { SchulkatalogantragActions } from './schulkatalogantrag.actions';

describe('SchulkatalogantragActions', () => {
    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/api/schulkatalogantrag',
    });

    it('should create the submitSchulkatalogantrag action', () => {
        const antrag: Schulkatalogantrag = {
            emailAuftraggeber: 'mail@provider.de',
            nameLand: 'Schweiz',
            nameOrt: 'Zürich',
            nameSchule: 'Primarschule Zügli',
            plz: '8768',
            strasseUndHausnummer: 'Schulgässli 8',
        };

        expect(SchulkatalogantragActions.submitSchulkatalogantrag({ antrag })).toEqual({
            type: '[MKA Schulkatalogantrag] submitSchulkatalogantrag',
            antrag,
        });
    });

    it('should create the submitSchulkatalogantragSucceeded action', () => {
        expect(SchulkatalogantragActions.submitSchulkatalogantragSucceeded()).toEqual({
            type: '[MKA Schulkatalogantrag] submitSchulkatalogantragSucceeded',
        });
    });

    it('should create the submitSchulkatalogantrag action', () => {
        const action = SchulkatalogantragActions.submitSchulkatalogantragFailed({ error: httpServerErrorResponse });

        expect(action).toEqual({
            type: '[MKA Schulkatalogantrag] submitSchulkatalogantragFailed',
            error: httpServerErrorResponse,
        });
    });
});
