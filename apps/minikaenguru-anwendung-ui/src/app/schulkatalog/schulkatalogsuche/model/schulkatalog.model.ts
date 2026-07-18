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
