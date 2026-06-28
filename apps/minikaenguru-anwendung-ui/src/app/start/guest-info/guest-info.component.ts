import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'mka-guest-info',
    imports: [MatIconModule],
    templateUrl: './guest-info.component.html',
    styleUrl: './guest-info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestInfoComponent {}
