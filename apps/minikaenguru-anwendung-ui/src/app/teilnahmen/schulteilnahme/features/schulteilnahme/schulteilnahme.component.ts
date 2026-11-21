import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeilnahmeInfoComponent } from '../../../components/teilnahme-info/teilnahme-info.component';
import { SchulteilnahmeFacade } from '../../api/schulteilnahme.facade';
import { KlassenListComponent } from '../klassen-list/klassen-list.component';

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
}
