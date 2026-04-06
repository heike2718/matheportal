import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MATHEPORTAL_SHELL_CONFIGURATION } from '@mp-shell-config';

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
    readonly isLoggedIn = false;

    @Output()
    sidenavClose = new EventEmitter();

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    };

    onLogin(): void {
        this.sidenavClose.emit();
        // folgt später
    }

    onLogout(): void {
        this.sidenavClose.emit();
        // folgt später
    }
}
