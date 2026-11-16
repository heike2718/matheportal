import { components } from '../../generated/api-types';

export type Auswertungsart = components['schemas']['Auswertungsart'];

export const AUSWERUNGSART = {
    online: 'ONLINE',
    offline: 'OFFLINE',
} as const satisfies Record<string, Auswertungsart>;

export type Teilnahme = components['schemas']['Teilnahme'];

export interface AuswertungsartDialogData {
    readonly schulkuerzel: string;
    readonly auswertungsart: Auswertungsart | undefined;
    readonly loesungszettelVorhanden: boolean;
}

export interface AuswertungsartDialogResult {
    schulkuerzel: string;
    gewaehlteAuswertungsart: Auswertungsart;
}

export type Person = components['schemas']['Person'];
