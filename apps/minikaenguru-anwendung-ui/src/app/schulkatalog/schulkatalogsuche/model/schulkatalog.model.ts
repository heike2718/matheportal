export type SCHULKATALOG_LOADING_STATE = 'not-loaded' | 'loaded' | 'not-found' | 'unauthorized' | 'technical-error';

export interface Land {
    readonly kuerzel: string;
    readonly name: string;
}

export interface Ort {
    readonly kuerzel: string;
    readonly name: string;
    readonly land: Land;
}

export interface Schule {
    readonly kuerzel: string;
    readonly name: string;
    readonly ort: Ort;
}
