import { components } from '../../generated/api-types';

export const LAND_KUERZEL_PATTERN = /^[A-Z-]*$/;
export const ORT_KUERZEL_PATTERN = /^[A-Z0-9]*$/;
export const SCHULE_KUERZEL_PATTERN = /^[A-Z0-9]*$/;

export type Land = components['schemas']['Land'];
export type Ort = components['schemas']['Ort'];
export type Schule = components['schemas']['Schule'];
export type SchuleAnlegenOderAendernRequest = components['schemas']['SchuleAnlegenOderAendernRequest'];
export type OrtMitSchuleAnlegenRequest = components['schemas']['OrtMitSchuleAnlegenRequest'];
export type LandMitOrtUndSchuleAnlegenRequest = components['schemas']['LandMitOrtUndSchuleAnlegenRequest'];
export type Schulkuerzel = components['schemas']['Schulkuerzel'];

export enum SCHULKATALOG_ADMIN_KONTEXT {
    laender = 'laender',
    orte = 'orte',
    schulen = 'schulen',
}

export type SchulkatalogAdminKontext = (typeof SCHULKATALOG_ADMIN_KONTEXT)[keyof typeof SCHULKATALOG_ADMIN_KONTEXT];

export const initialLandMitOrtUndSchuleAnlegenRequest: LandMitOrtUndSchuleAnlegenRequest = {
    emailAuftraggeber: '',
    kuerzelLand: '',
    nameLand: '',
    nameOrt: '',
    nameSchule: '',
};

export const initialOrtMitSchuleAnlegenRequest: OrtMitSchuleAnlegenRequest = {
    emailAuftraggeber: '',
    nameOrt: '',
    nameSchule: '',
};

export interface OrtMitSchuleAnlegenDialogData {
    readonly land: Land;
    readonly payload: OrtMitSchuleAnlegenRequest;
}

export const initialSchuleAnlegenOderAendernRequest: SchuleAnlegenOderAendernRequest = {
    emailAuftraggeber: '',
    name: '',
};

export interface SchuleDialogData {
    readonly ort: Ort;
    readonly payload: SchuleAnlegenOderAendernRequest;
    readonly submitButtonLabel: string;
}
