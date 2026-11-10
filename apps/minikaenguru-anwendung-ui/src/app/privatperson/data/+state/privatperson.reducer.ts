import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { PrivatpersonActions } from './privatperson.actions';
import { mapErrorToAuthorizedResourceLoadState } from '@matheportal/shared-utils';
import { teilnahmeAngemeldet } from '../../../teilnahme/api/teilnahme-store.events';
import { ANMELDESTATUS, TeilnahmeReferenz } from '../../../core/model/wettbewerbskontext.model';

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
    reducer: createReducer<PrivatpersonState>(
        initialPrivatpersonState,
        on(PrivatpersonActions.wettbewerbskontextLaden, state => {
            return state.wettbewerbskontextLoadState === 'loaded' ||
                state.wettbewerbskontextLoadState === 'technical-error'
                ? initialPrivatpersonState
                : state;
        }),
        on(PrivatpersonActions.wettbewerbskontextGeladen, (state, { wettbewerbskontext }) => ({
            ...state,
            wettbewerbskontext,
            wettbewerbskontextLoadState: 'loaded',
        })),
        on(PrivatpersonActions.wettbewerbskontextLadenFailed, (state, { error }) => ({
            ...state,
            wettbewerbskontext: undefined,
            wettbewerbskontextLoadState: mapErrorToAuthorizedResourceLoadState(error, false),
        })),
        on(teilnahmeAngemeldet, (state, { teilnahme }) => {
            if (state.wettbewerbskontext) {
                const newTeilnahmeRef: TeilnahmeReferenz = { jahr: teilnahme.jahr, teilnahmenummer: teilnahme.kuerzel };

                const isDuplicate = state.wettbewerbskontext.teilnahmerefs.some(
                    item =>
                        item.jahr === newTeilnahmeRef.jahr && item.teilnahmenummer === newTeilnahmeRef.teilnahmenummer
                );

                const teilnahmerefs = isDuplicate
                    ? [...state.wettbewerbskontext.teilnahmerefs]
                    : [...state.wettbewerbskontext.teilnahmerefs, newTeilnahmeRef];

                return {
                    ...state,
                    wettbewerbskontext: {
                        ...state.wettbewerbskontext,
                        anmeldestatus: ANMELDESTATUS.bereitsAngemeldet,
                        teilnahmerefs,
                    },
                };
            }
            return state;
        }),
        on(userLoggedOut, () => initialPrivatpersonState)
    ),
});
