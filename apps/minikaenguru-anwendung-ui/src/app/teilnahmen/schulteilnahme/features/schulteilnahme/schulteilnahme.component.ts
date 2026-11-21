import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeilnahmeInfoComponent } from '../../../components/teilnahme-info/teilnahme-info.component';
import { SchulteilnahmeFacade } from '../../api/schulteilnahme.facade';
import { KlassenListComponent } from '../klassen-list/klassen-list.component';
import { Klasse } from '../../model/klasse.model';

@Component({
    selector: 'mka-schulteilnahme',
    imports: [RouterLink, TeilnahmeInfoComponent, KlassenListComponent],
    templateUrl: './schulteilnahme.component.html',
    styleUrl: './schulteilnahme.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchulteilnahmeComponent {
    readonly #schulteilnahmeFacade = inject(SchulteilnahmeFacade);

    readonly teilnahme = this.#schulteilnahmeFacade.aktuelleTeilnahme;

    readonly klassen = this.#schulteilnahmeFacade.klassen;

    onKlasseSelected(klasse: Klasse): void {
        this.#schulteilnahmeFacade.klasseAusgewaehlt(klasse);
    }

    onKlasseAnlegen(): void {
        this.#schulteilnahmeFacade.klasseAnlegenRequested();
    }

    onAlleKlassenLoeschen(): void {
        this.#schulteilnahmeFacade.alleKlassenLoeschenRequested();
    }

    onKlassenlisteHochladen(): void {
        console.log('hier gehört ein FileUpload hin');
    }
}
