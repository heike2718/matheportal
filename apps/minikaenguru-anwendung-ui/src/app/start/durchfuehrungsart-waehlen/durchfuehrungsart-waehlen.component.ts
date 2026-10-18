import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WettbewerbsdurchfuehrendeFacade } from '../../core/wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende.facade';

@Component({
    selector: 'mka-durchfuehrungsart-waehlen',
    imports: [],
    templateUrl: './durchfuehrungsart-waehlen.component.html',
    styleUrl: './durchfuehrungsart-waehlen.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurchfuehrungsartWaehlenComponent {
    #wettbewerbsdurchfuehrendeFacade = inject(WettbewerbsdurchfuehrendeFacade);

    selectSchule(): void {
        this.#wettbewerbsdurchfuehrendeFacade.durchfuehrungsartSchuleGewaehlt();
    }

    selectPrivat(): void {
        this.#wettbewerbsdurchfuehrendeFacade.durchfuehrungsartPrivatGewaehlt();
    }
}
