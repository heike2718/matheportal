import { Klasse } from '../model/klasse.model';

export function findKlasse(klasseId: string, klassen: Klasse[]): Klasse | undefined {
    return klassen.find(klasse => klasseId === klasse.uuid);
}
