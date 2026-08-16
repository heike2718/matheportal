export interface Land {
    readonly kuerzel: string;
    readonly name: string;
    readonly anzahlOrte: number;
}

export interface Ort {
    readonly kuerzel: string;
    readonly name: string;
    readonly land: Land;
    readonly anzahlSchulen: number;
}

export interface Schule {
    readonly kuerzel: string;
    readonly name: string;
    readonly ort: Ort;
}
