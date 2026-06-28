import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MATHEPORTAL_SHELL_CONFIGURATION } from '../../config/matheportal-shell.configuration';
import { AuthFlowFacade, AuthSessionFacade } from '@matheportal/auth-api';

@Component({
    selector: 'portal-sidenav',
    imports: [RouterLink, RouterLinkActive, MatListModule, MatButtonModule, MatIconModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
    readonly config = inject(MATHEPORTAL_SHELL_CONFIGURATION);
    readonly version = this.config.version;

    authSessionFacade = inject(AuthSessionFacade);

    #authFlowFacade = inject(AuthFlowFacade);

    @Output()
    sidenavClose = new EventEmitter();

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    };

    onLogin(): void {
        this.#authFlowFacade.login();
    }

    onLogout(): void {
        this.#authFlowFacade.logout();
    }

    onSignup(): void {
        this.#authFlowFacade.signup();
    }
}
