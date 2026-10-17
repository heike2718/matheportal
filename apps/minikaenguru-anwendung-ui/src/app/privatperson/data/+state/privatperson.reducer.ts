import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { createFeature, createReducer } from '@ngrx/store';

export const PRIVATPERSON_FEATURE_KEY = 'MKAPrivatperson';

export interface PrivatpersonState {
    wettbewerbskontextLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
    wettbewerbskontext: PrivatpersonWettbewerbskontext | undefined;
}

export const initialPrivatpersonState: PrivatpersonState = {
    wettbewerbskontextLoadState: 'not-loaded',
    wettbewerbskontext: undefined,
};

export const privatpersonFeature = createFeature({
    name: PRIVATPERSON_FEATURE_KEY,
    reducer: createReducer<PrivatpersonState>(initialPrivatpersonState),
});
