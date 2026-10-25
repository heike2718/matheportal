import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PrivatpersonFacade } from '../../api/privatperson.facade';
import { WETTBEWERBSSTATUS } from '../../../core/wettbewerb/model/wettbewerb.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TeilnahmeReferenz } from '../../../core/model/schule-wettbewerbskontext.model';

@Component({
    selector: 'mka-dashboard-privatperson',
    imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule],
    templateUrl: './dashboard-privatperson.component.html',
    styleUrl: './dashboard-privatperson.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPrivatpersonComponent {
    #privatpersonFacade = inject(PrivatpersonFacade);

    readonly aktuellerWettbewerb = computed(() => {
        const wettbewerb = this.#privatpersonFacade.aktuellerWettbewerb();

        if (!wettbewerb) {
            throw new Error('Aktueller Wettbewerb ist nicht geladen');
        }

        return wettbewerb;
    });

    readonly wettbewerbskontextLoaded = this.#privatpersonFacade.wettbewerbskontextLoaded;

    readonly wettbewerbskontext = this.#privatpersonFacade.wettbewerbskontext;

    readonly teilnahmen = computed(() => {
        if (this.wettbewerbskontext()) {
            return this.wettbewerbskontext()?.teilnahmerefs;
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

    readonly wettbewerbBeendet = computed(() => this.aktuellerWettbewerb().status === WETTBEWERBSSTATUS.beendet);

    readonly anmeldungMoeglich = computed(() => this.wettbewerbskontext()?.anmeldungMoeglich);

    public privatteilnahmeAnmelden(): void {
        console.log('jetzt action triggern zum Anmelden der Privatteilnahme');
    }

    public statistikHerunterladen(teilnahme: TeilnahmeReferenz): void {
        console.log('jetzt action triggern zum Herunterladen der Statistik für ' + teilnahme.jahr);
    }
}
