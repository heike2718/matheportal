import { components } from '../../../generated/api-types';

export type Wettbewerbsstatus = components['schemas']['Wettbewerbsstatus'];

export const WETTBEWERBSSTATUS = {
    erfasst: 'ERFASST',
    anmeldung: 'ANMELDUNG',
    downloadSchule: 'DOWNLOAD_LEHRER',
    downloadPrivat: 'DOWNLOAD_PRIVAT',
    beendet: 'BEENDET',
} as const satisfies Record<string, Wettbewerbsstatus>;

export type Wettbewerb = components['schemas']['Wettbewerb'];
