import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SchuleFacade } from '../../api/schule.facade';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TeilnahmeReferenz } from '../../../core/model/schule-wettbewerbskontext.model';

@Component({
    selector: 'mka-schule-dashboard',
    imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule],
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

    readonly wettbewerbskontext = this.#schuleFacade.wettbewerbskontext;

    readonly schulauswahlMoeglich = this.#schuleFacade.schulauswahlMoeglich;

    readonly schule = computed(() => this.wettbewerbskontext()?.schule);

    readonly teilnahmen = computed(() => {
        if (this.wettbewerbskontext()) {
            return this.wettbewerbskontext()?.teilnahmerefs;
        }
        return [];
    });

    readonly kollegen = computed(() => {
        if (this.#schuleFacade.schulkollegiumLoaded() && this.wettbewerbskontext()) {
            return this.wettbewerbskontext()?.kollegen;
        }
        return [];
    });

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

    readonly anmeldungMoeglich = computed(() => this.wettbewerbskontext()?.anmeldungMoeglich);

    readonly vertragDSGVOVorhanden = computed(() => this.wettbewerbskontext()?.vertragDSGVOVorhanden);

    readonly kollegenAnzeigen = computed(() => this.kollegen.length > 0);

    public schuleWechseln(): void {
        console.log('jetzt wettbewerbsorganisationVerlassen triggern');
    }

    public schuleAnmelden(): void {
        console.log('jetzt action triggern zum Anmelden der Schule');
    }

    public dsgvoVertragHerunterladen(): void {
        console.log('jetzt action triggern zum Herunterladen DSGVO-Vertrags');
    }

    public dsgvoVertragAbschliessen(): void {
        console.log('jetzt action triggern zum Abschließen eines DSGVO-Vertrags');
    }

    public statistikHerunterladen(teilnahme: TeilnahmeReferenz): void {
        console.log('jetzt action triggern zum Herunterladen der Statistik für ' + teilnahme.jahr);
    }
}
