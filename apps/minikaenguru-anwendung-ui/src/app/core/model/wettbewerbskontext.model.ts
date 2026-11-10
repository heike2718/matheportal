import { components } from '../../generated/api-types';

export type Anmeldestatus = components['schemas']['Anmeldestatus'];

export const ANMELDESTATUS = {
    nochNichtMoeglich: 'NOCH_NICHT_MOEGLICH',
    nichtMehrMoeglich: 'NICHT_MEHR_MOEGLICH',
    bereitsAngemeldet: 'BEREITS_ANGEMELDET',
    moeglich: 'MOEGLICH',
} as const satisfies Record<string, Anmeldestatus>;

export type TeilnahmeReferenz = components['schemas']['TeilnahmeReferenz'];
