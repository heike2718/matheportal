import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { resolveRaetselbaukastenBerechtigung } from '../core/auth/raetselbaukasten-berechtigung.utils';
import { RAETSELBAUKASTEN_BERECHTIGUNG } from '../core/auth/raetselbaukasten-berechtigung.model';

@Component({
    selector: 'rbk-dashboard',
    imports: [RouterModule, MatCardModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
    #authSessionFacade = inject(AuthSessionFacade);

    readonly #berechtigung = computed(() => resolveRaetselbaukastenBerechtigung(this.#authSessionFacade.user()));

    readonly isAuthorized = computed(() => this.#berechtigung() !== RAETSELBAUKASTEN_BERECHTIGUNG.none);
    readonly isStandardUser = computed(() => this.#berechtigung() === RAETSELBAUKASTEN_BERECHTIGUNG.standard);
    readonly isAutor = computed(() => this.#berechtigung() === RAETSELBAUKASTEN_BERECHTIGUNG.autor);
    readonly isAdmin = computed(() => this.#berechtigung() === RAETSELBAUKASTEN_BERECHTIGUNG.admin);
}
