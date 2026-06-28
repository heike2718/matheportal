import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { DashboardLehrerComponent } from '../../lehrperson/dashboard-lehrer/dashboard-lehrer.component';
import { DashboardPrivatComponent } from '../../privat/dashboard-privat/dashboard-privat.component';

@Component({
    selector: 'mka-start',
    imports: [GuestInfoComponent, DashboardLehrerComponent, DashboardPrivatComponent],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
    readonly mkaAuthorizationFacade = inject(MkaAuthorizationFacade);

    #veranstalterAnlegenDialogOpened = false;

    constructor() {
        effect(() => {
            const viewState = this.mkaAuthorizationFacade.startViewState();

            if (viewState !== 'veranstalter-anlegen') {
                this.#veranstalterAnlegenDialogOpened = false;
                return;
            }

            if (this.#veranstalterAnlegenDialogOpened) {
                return;
            }

            this.#veranstalterAnlegenDialogOpened = true;
            this.#openVeranstalterAnlegenDialog();
        });
    }

    ngOnInit(): void {
        this.mkaAuthorizationFacade.ensureAuthorizationLoaded();
    }

    #openVeranstalterAnlegenDialog(): void {
        console.log('hier den Dialog öffnen');
    }
}
