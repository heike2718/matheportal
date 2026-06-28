import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { DashboardLehrerComponent } from '../../lehrperson/dashboard-lehrer/dashboard-lehrer.component';
import { DashboardPrivatComponent } from '../../privat/dashboard-privat/dashboard-privat.component';
import { TeilnahmeartWaehlenDialogComponent } from '../teilnahmeart-waehlen-dialog/teilnahmeart-waehlen-dialog.component';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { GewaehlteTeilnahmeart } from '../teilnahmeart-waehlen-dialog/teilnahmeart-vaehlen-dialog.model';
import { take, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'mka-start',
    imports: [GuestInfoComponent, DashboardLehrerComponent, DashboardPrivatComponent, DialogModule],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
    readonly mkaAuthorizationFacade = inject(MkaAuthorizationFacade);

    #dialog = inject(Dialog);
    #veranstalterAnlegenDialogOpened = false;
    #router = inject(Router);

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
