import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthSessionFacade } from '@matheportal/auth-api';

@Component({
    selector: 'mka-guest-info',
    imports: [MatIconModule],
    templateUrl: './guest-info.component.html',
    styleUrl: './guest-info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestInfoComponent {
    authSessionFacade = inject(AuthSessionFacade);
}
