import { Land, Ort } from '../model/schulkatalog.model';

export function getBeschreibungSelectedOrt(ort: Ort | undefined): string {
    if (!ort) {
        return '';
    }
    if (ort.name === ort.land.name) {
        return ort.name;
    }

    return ort.name + ' (' + ort.land.name + ')';
}

export function getNameSelectedLand(land: Land | undefined): string {
    if (!land) {
        return '';
    }

    return land.name;
}
