import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SchulteilnahmeFacade } from '../../api/schulteilnahme.facade';
@Component({
    imports: [],
    templateUrl: './klasse-dashboard.component.html',
    styleUrl: './klasse-dashboard.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlasseDashboardComponent {
    readonly #schulteilnahmeFacade = inject(SchulteilnahmeFacade);

    readonly klasse = this.#schulteilnahmeFacade.ausgewaehlteKlasse;
}
