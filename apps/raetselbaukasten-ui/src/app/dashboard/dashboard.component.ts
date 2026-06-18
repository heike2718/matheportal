import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { resolveRaetselbaukastenUserRole } from '../core/auth/raetselbaukasten-role.utils';
import { RAETSELBAUKASTEN_ROLE } from '../core/auth/raetselbaukasten-role.model';

@Component({
    selector: 'rbk-dashboard',
    imports: [RouterModule, MatCardModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
    #authSessionFacade = inject(AuthSessionFacade);

    private readonly user = toSignal(this.#authSessionFacade.user$, {
        initialValue: null,
    });

    private readonly userRole = computed(() => resolveRaetselbaukastenUserRole(this.user()));

    readonly isAuthorized = computed(() => this.userRole() !== RAETSELBAUKASTEN_ROLE.NONE);
    readonly isStandardUser = computed(() => this.userRole() === RAETSELBAUKASTEN_ROLE.STANDARD);
    readonly isAutor = computed(() => this.userRole() === RAETSELBAUKASTEN_ROLE.AUTOR);
    readonly isAdmin = computed(() => this.userRole() === RAETSELBAUKASTEN_ROLE.ADMIN);
}
