import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mp-message',
    imports: [],
    templateUrl: './message.component.html',
    styleUrl: './message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {}
