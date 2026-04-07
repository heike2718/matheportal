import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './layout/sidenav/sidenav.component';

@Component({
    imports: [RouterModule, MatToolbarModule, MatSidenavModule, NavbarComponent, SidenavComponent],
    selector: 'portal-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
