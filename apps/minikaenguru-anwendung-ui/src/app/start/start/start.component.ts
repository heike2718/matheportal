import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'mka-start',
    imports: [GuestInfoComponent],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
    readonly authSessionFacade = inject(AuthSessionFacade);
    readonly #mkaAuthorizationFacade = inject(MkaAuthorizationFacade);

    readonly #authLoadState = toSignal(this.#mkaAuthorizationFacade.authorizationLoadState$);

    readonly authorizationFailed = computed(() => this.#authLoadState() === 'failed');

    ngOnInit(): void {
        this.#mkaAuthorizationFacade.minikaenguruAufgerufen();
    }
}
