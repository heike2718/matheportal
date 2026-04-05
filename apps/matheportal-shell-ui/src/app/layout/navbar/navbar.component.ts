import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLinkWithHref } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'portal-navbar',
	imports: [
		MatMenuModule,
		MatIconModule,
		MatListModule,
		MatToolbarModule,
		MatTooltipModule,
		RouterLinkWithHref,
		AsyncPipe,
	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
	@Output()
	sidenavToggle = new EventEmitter();

	#breakpointObserver = inject(BreakpointObserver);
	#router = inject(Router);

	isHandset$ = this.#breakpointObserver.observe(Breakpoints.Handset).pipe(
		map(result => result.matches),
		shareReplay()
	);

	onToggleSidenav(): void {
		this.sidenavToggle.emit();
	}

	onMenuItemClick(id: number): void {
		this.#router.navigate(['/home', id]);
	}
}
