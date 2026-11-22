import { inject, Injectable } from '@angular/core';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    selectAktuelleTeilnahmeLoaded,
    selectAngemeldet,
    selectAnmeldendePersonGeladen,
    selectAusgewaehlteKlasse,
    selectKlassen,
    selectKlassenLoadState,
    selectKlassenLoadStateAndKlassen,
    selectTeilnahme,
    selectTeilnahmeLoadState,
} from '../data/+state/schulteilnahme.selectors';
import { SchulteilnahmeActions } from '../data/+state/schulteilnahme.actions';
import { Klasse } from '../model/klasse.model';

@Injectable()
export class SchulteilnahmeFacade {
    readonly #store = inject(Store);

    readonly teilnahmeLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE> =
        this.#store.select(selectTeilnahmeLoadState);

    readonly klassenLoadStateAndKlassen$: Observable<{
        klassenLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
        klassen: Klasse[];
    }> = this.#store.select(selectKlassenLoadStateAndKlassen);

    readonly aktuelleTeilnahmeLoaded = this.#store.selectSignal(selectAktuelleTeilnahmeLoaded);

    readonly angemeldet = this.#store.selectSignal(selectAngemeldet);

    readonly aktuelleTeilnahme = this.#store.selectSignal(selectTeilnahme);

    readonly anmeldendePersonGeladen = this.#store.selectSignal(selectAnmeldendePersonGeladen);

    readonly klassen = this.#store.selectSignal(selectKlassen);

    readonly ausgewaehlteKlasse = this.#store.selectSignal(selectAusgewaehlteKlasse);

    public klasseAusgewaehlt(klasse: Klasse): void {
        this.#store.dispatch(SchulteilnahmeActions.klasseAusgewaehlt({ klasse }));
    }

    public aktuelleSchulteilnahmeVorbereiten(schulkuerzel: string): void {
        this.#store.dispatch(SchulteilnahmeActions.ensureSchulteilnahmeGeladen({ schulkuerzel }));
    }

    public klassenLaden(schulkuerzel: string) {
        this.#store.dispatch(SchulteilnahmeActions.klassenLaden({ schulkuerzel }));
    }

    public klasseAusRouteErmittelt(klasse: Klasse) {
        this.#store.dispatch(SchulteilnahmeActions.klasseAusRouteErmittelt({ klasse }));
    }

    public klasseAnlegenRequested(schulkuerzel: string | undefined): void {
        if (schulkuerzel === undefined) {
            // das sollte nicht auftreten, wenn die Orchestrierung des Kontexts korrekt implementiert ist.
            return;
        }
        this.#store.dispatch(SchulteilnahmeActions.klasseAnlegenRequested({ schulkuerzel }));
    }

    public alleKlassenLoeschenRequested(): void {
        console.log('action dispatchen, der einen Warndialog öffnet und ggf. das Löschen orchestriert');
    }
}
