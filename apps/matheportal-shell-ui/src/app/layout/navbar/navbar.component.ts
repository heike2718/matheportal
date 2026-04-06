import { AsyncPipe } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map, shareReplay } from 'rxjs';

import { MATHEPORTAL_SHELL_CONFIGURATION } from '../../config/matheportal-shell.configuration';

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

    // Platzhalter bis Auth angebunden ist
    readonly isLoggedIn = false;
    readonly displayName = 'Gast';

    isHandset$ = this.#breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches),
        shareReplay(1)
    );

    onToggleSidenav(): void {
        this.sidenavToggle.emit();
    }

    onLogin(): void {
        // folgt später
    }

    onLogout(): void {
        // folgt später
    }
}
