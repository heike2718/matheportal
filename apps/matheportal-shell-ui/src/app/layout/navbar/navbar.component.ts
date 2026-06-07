import { AsyncPipe } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map, shareReplay } from 'rxjs';

import { MATHEPORTAL_SHELL_CONFIGURATION } from '../../config/matheportal-shell.configuration';
import { AuthFlowFacade, AuthSessionFacade } from '@matheportal/auth-api';

@Component({
    selector: 'portal-navbar',
    imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink, RouterLinkActive, AsyncPipe],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
    @Output()
    sidenavToggle = new EventEmitter<void>();

    readonly #breakpointObserver = inject(BreakpointObserver);
    readonly #config = inject(MATHEPORTAL_SHELL_CONFIGURATION);

    readonly version = this.#config.version;

    authSessionFacade = inject(AuthSessionFacade);

    #authFlowFacade = inject(AuthFlowFacade);

    isHandset$ = this.#breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches),
        shareReplay(1)
    );

    onToggleSidenav(): void {
        this.sidenavToggle.emit();
    }

    onLogin(): void {
        this.#authFlowFacade.login();
    }

    onLogout(): void {
        this.#authFlowFacade.logout();
    }
}
