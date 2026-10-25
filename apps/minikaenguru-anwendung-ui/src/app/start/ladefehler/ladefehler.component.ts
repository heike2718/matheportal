import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'mka-ladefehler',
    imports: [MatCardModule, MatIconModule],
    templateUrl: './ladefehler.component.html',
    styleUrl: './ladefehler.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LadefehlerComponent {}
