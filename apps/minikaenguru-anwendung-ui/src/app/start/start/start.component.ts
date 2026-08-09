import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { DashboardLehrpersonComponent } from '../../lehrperson/dashboard-lehrperson/dashboard-lehrperson.component';
import { DashboardPrivatpersonComponent } from '../../privatperson/dashboard-privatperson/dashboard-privatperson.component';
import { GewaehlteDurchfuehrungsart } from '../durchfuehrungsart-waehlen/durchfuehrungsart-waehlen.model';
import { WettbewerbsdurchfuehrendeFacade } from '../../core/wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende.facade';
import { DurchfuehrungsartWaehlenComponent } from '../durchfuehrungsart-waehlen/durchfuehrungsart-waehlen.component';

@Component({
    selector: 'mka-start',
    imports: [
        GuestInfoComponent,
        DashboardLehrpersonComponent,
        DashboardPrivatpersonComponent,
        DurchfuehrungsartWaehlenComponent,
    ],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
    readonly mkaAuthorizationFacade = inject(MkaAuthorizationFacade);
    #wettbewerbsdurchfuehrendeFacade = inject(WettbewerbsdurchfuehrendeFacade);

    ngOnInit(): void {
        this.mkaAuthorizationFacade.ensureAuthorizationLoaded();
    }

    handleDurchfuehrungsartGewaehlt(gewaehlteDurchfuehrungsart: GewaehlteDurchfuehrungsart): void {
        switch (gewaehlteDurchfuehrungsart) {
            case 'privat':
                this.#wettbewerbsdurchfuehrendeFacade.durchfuehrungsartPrivatGewaehlt();
                break;
            case 'schule':
                this.#wettbewerbsdurchfuehrendeFacade.durchfuehrungsartSchuleGewaehlt();
                break;
            default:
                throw new Error('unbekannte Durchführungsart');
        }
    }
}
