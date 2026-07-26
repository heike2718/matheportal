import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SchulkatalogsucheFacade } from '../../api/schulkatalogsuche.facade';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { OrteSuchenComponent } from '../orte-suchen-component/orte-suchen.component';

@Component({
    selector: 'mka-schulkatalogsuche',
    imports: [OrteSuchenComponent],
    templateUrl: './schulkatalogsuche.component.html',
    styleUrl: './schulkatalogsuche.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchulkatalogsucheComponent {
    private facade = inject(SchulkatalogsucheFacade);

    readonly orte = this.facade.orte;

    readonly isOrteLoaded = this.facade.isOrteLoaded;

    onSearchTermOrtChanged(term: string): void {
        this.facade.findOrte(term);
    }

    onOrtSelected(ort: Ort): void {
        this.facade.ortSelected(ort);
    }

    onSchuleSelected(schule: Schule): void {
        this.facade.schuleSelected(schule);
    }
}
