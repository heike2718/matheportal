import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mp-loading-indicator',
    imports: [],
    templateUrl: './loading-indicator.component.html',
    styleUrl: './loading-indicator.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIndicatorComponent {}
