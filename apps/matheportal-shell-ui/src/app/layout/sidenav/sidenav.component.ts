import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'portal-sidenav',
    imports: [],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {}
