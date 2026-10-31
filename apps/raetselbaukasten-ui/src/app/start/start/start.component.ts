import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { RaetselbaukastenEinstiegFacade } from '../../core/ablaufsteuerung/raetselbaukasten-einstieg.facade';

@Component({
    selector: 'rbk-start',
    imports: [GuestInfoComponent],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
    authSessionFacade = inject(AuthSessionFacade);

    #raetselbaukastenEinstiegFacade = inject(RaetselbaukastenEinstiegFacade);

    ngOnInit(): void {
        this.#raetselbaukastenEinstiegFacade.raetselbaukastenAufgerufen();
    }
}
