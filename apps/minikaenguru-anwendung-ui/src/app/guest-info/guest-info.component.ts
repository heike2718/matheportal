import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mka-guest-info',
    imports: [],
    templateUrl: './guest-info.component.html',
    styleUrl: './guest-info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestInfoComponent {}
