import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { WettbewerbFacade } from '../../core/wettbewerb/api/wettbewerb.facade';

@Component({
    selector: 'mka-guest-info',
    imports: [MatIconModule],
    templateUrl: './guest-info.component.html',
    styleUrl: './guest-info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestInfoComponent {
    wettbewerbFacade = inject(WettbewerbFacade);
    authSessionFacade = inject(AuthSessionFacade);
}
