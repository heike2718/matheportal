import { Ort } from '../model/schulkatalog.model';

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
