import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { DashboardLehrpersonComponent } from '../../lehrperson/dashboard-lehrperson/dashboard-lehrperson.component';
import { DashboardPrivatpersonComponent } from '../../privatperson/dashboard-privatperson/dashboard-privatperson.component';
import { GewaehlteDurchfuehrungsart } from '../durchfuehrungsart-waehlen-dialog/durchfuehrungsart-waehlen-dialog.model';
import { DurchfuehrungsartWaehlenDialogComponent } from '../durchfuehrungsart-waehlen-dialog/durchfuehrungsart-waehlen-dialog.component';

@Component({
    selector: 'mka-start',
    imports: [GuestInfoComponent, DashboardLehrpersonComponent, DashboardPrivatpersonComponent, DialogModule],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
    readonly mkaAuthorizationFacade = inject(MkaAuthorizationFacade);

    #dialog = inject(Dialog);
    #durchfuehrendenAnlegenDialogOpened = false;
    #router = inject(Router);

    constructor() {
        effect(() => {
            const viewState = this.mkaAuthorizationFacade.startViewState();

            if (viewState !== 'needs-wettbewerbsdurchfuehrenden') {
                this.#durchfuehrendenAnlegenDialogOpened = false;
                return;
            }

            if (this.#durchfuehrendenAnlegenDialogOpened) {
                return;
            }

            this.#durchfuehrendenAnlegenDialogOpened = true;
            this.#openDurchfuerendenAnlegenDialog();
        });
    }

    ngOnInit(): void {
        this.mkaAuthorizationFacade.ensureAuthorizationLoaded();
    }

    #openDurchfuerendenAnlegenDialog(): void {
        const dialogRef = this.#dialog.open<GewaehlteDurchfuehrungsart | undefined>(
            DurchfuehrungsartWaehlenDialogComponent,
            {
                autoFocus: 'dialog',
                maxHeight: '90vh',
            }
        );
        dialogRef.closed
            .pipe(
                take(1),
                tap(durchfuehrungsart => {
                    this.#onDurchfuehrungsartGewaehlt(durchfuehrungsart);
                })
            )
            .subscribe();
    }

    #onDurchfuehrungsartGewaehlt(durchfuehrungsart: GewaehlteDurchfuehrungsart | undefined): void {
        if (!durchfuehrungsart || durchfuehrungsart === 'nicht_durchfuehren') {
            this.#router.navigateByUrl('/minikaenguru-anwendung/guests');
            return;
        } else {
            console.log('Durchführungsart=' + durchfuehrungsart);
        }
    }
}
