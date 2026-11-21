import { components } from '../../../generated/api-types';

export type Klasse = components['schemas']['Klasse'];
export type KlasseRequest = components['schemas']['KlasseRequest'];

export interface KlasseDialogData {
    readonly name: string;
    readonly submitButtonLabel: string;
}
