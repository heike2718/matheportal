import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SchuleFacade } from '../../api/schule.facade';

@Component({
    selector: 'mka-schule-dashboard',
    imports: [],
    templateUrl: './schule-dashboard.component.html',
    styleUrl: './schule-dashboard.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchuleDashboardComponent {
    readonly #schuleFacade = inject(SchuleFacade);

    readonly aktuellerWettbewerb = computed(() => {
        const wettbewerb = this.#schuleFacade.aktuellerWettbewerb();

        if (!wettbewerb) {
            throw new Error('Aktueller Wettbewerb ist nicht geladen');
        }

        return wettbewerb;
    });

    readonly wettbewerbskontextLoaded = this.#schuleFacade.wettbewerbskontextLoaded;

    readonly schule = this.#schuleFacade.schule;

    readonly schulauswahlMoeglich = this.#schuleFacade.anmeldungMoeglich;

    readonly teilnahmen = this.#schuleFacade.teilnahmen;

    readonly kollegen = this.#schuleFacade.kollegen;

    readonly aktuelleTeilnahme = computed(() => {
        const alleTeilnahmen = this.teilnahmen();
        const resultList = alleTeilnahmen?.filter(t => t.jahr === this.aktuellerWettbewerb().jahr);
        return resultList === undefined || resultList.length === 0 ? undefined : resultList[0];
    });

    readonly fruehereTeilnahmen = computed(() => {
        const alleTeilnahmen = this.teilnahmen();
        const resultList = alleTeilnahmen?.filter(t => t.jahr !== this.aktuellerWettbewerb().jahr);
        return resultList === undefined ? [] : resultList;
    });

    readonly anmeldungMoeglich = this.#schuleFacade.anmeldungMoeglich;

    readonly vertragDSGVOVorhanden = this.#schuleFacade.vertragDSGVOVorhanden;

    readonly kollegenAnzeigen = computed(() => this.kollegen.length > 0);
}
