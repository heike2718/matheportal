import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { TeilnahmeartWaehlenDialogComponent } from '../teilnahmeart-waehlen-dialog/teilnahmeart-waehlen-dialog.component';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { GewaehlteTeilnahmeart } from '../teilnahmeart-waehlen-dialog/teilnahmeart-vaehlen-dialog.model';
import { take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { DashboardLehrpersonComponent } from '../../lehrperson/dashboard-lehrperson/dashboard-lehrperson.component';
import { DashboardPrivatpersonComponent } from '../../privatperson/dashboard-privatperson/dashboard-privatperson.component';

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

            if (viewState !== 'wettbewerbsdurchfuehrenden-anlegen') {
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
        const dialogRef = this.#dialog.open<GewaehlteTeilnahmeart | undefined>(TeilnahmeartWaehlenDialogComponent, {
            autoFocus: 'dialog',
            maxHeight: '90vh',
        });
        dialogRef.closed
            .pipe(
                take(1),
                tap(teilnahmeart => {
                    this.#onTeilnahmeartGewaehlt(teilnahmeart);
                })
            )
            .subscribe();
    }

    #onTeilnahmeartGewaehlt(teilnahmeart: GewaehlteTeilnahmeart | undefined): void {
        if (!teilnahmeart || teilnahmeart === 'nicht_teilnehmen') {
            this.#router.navigateByUrl('/minikaenguru-anwendung/guests');
            return;
        } else {
            console.log('Teilnahmeart=' + teilnahmeart);
        }
    }
}
