import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Teilnahme } from '../../model/teilnahme.model';

@Component({
    selector: 'mka-teilnahme-info',
    imports: [MatCardModule],
    templateUrl: './teilnahme-info.component.html',
    styleUrl: './teilnahme-info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeilnahmeInfoComponent {
    readonly teilnahme = input.required<Teilnahme>();
}
