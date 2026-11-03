import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { RaetselbaukastenEinstiegFacade } from '../../core/ablaufsteuerung/raetselbaukasten-einstieg.facade';

@Component({
    selector: 'rbk-start',
    imports: [],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
    portalSessionFacade = inject(PortalSessionFacade);

    #raetselbaukastenEinstiegFacade = inject(RaetselbaukastenEinstiegFacade);

    ngOnInit(): void {
        this.#raetselbaukastenEinstiegFacade.raetselbaukastenAufgerufen();
    }
}
