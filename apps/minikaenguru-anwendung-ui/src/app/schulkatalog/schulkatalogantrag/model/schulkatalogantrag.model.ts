import { components } from '../../../generated/api-types';

export type Schulkatalogantrag = components['schemas']['Schulkatalogantrag'];

export const initialSchulkatalogantrag: Schulkatalogantrag = {
    emailAuftraggeber: '',
    nameLand: '',
    nameOrt: '',
    nameSchule: '',
    plz: '',
    strasseUndHausnummer: '',
};
