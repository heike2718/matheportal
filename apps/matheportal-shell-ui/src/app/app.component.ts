import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { AuthFlowFacade } from '@matheportal/auth-api';
import { MessageComponent, LoadingIndicatorComponent } from '@matheportal/feedback-ui';
import { matheportalShellConfiguration } from './config/configuration';

@Component({
    imports: [
        RouterModule,
        MatToolbarModule,
        MatSidenavModule,
        NavbarComponent,
        SidenavComponent,
        MessageComponent,
        LoadingIndicatorComponent,
    ],
    selector: 'portal-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    #authFlowFacade = inject(AuthFlowFacade);

    ngOnInit(): void {
        console.log(JSON.stringify(matheportalShellConfiguration));

        this.#authFlowFacade.initClearOrRestoreSession();
    }
}
