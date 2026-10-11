import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Schule } from '../../../core/model/schulkatalog.model';

@Component({
    selector: 'mka-schule-card',
    imports: [],
    templateUrl: './schule-card.component.html',
    styleUrl: './schule-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchuleCardComponent {
    readonly schule = input.required<Schule>();
    readonly schuleSelected = output<Schule>();

    readonly ortUndLand = computed(() => {
        const { name, land } = this.schule().ort;

        return name === land.name ? name : `${name} · ${land.name}`;
    });
}
