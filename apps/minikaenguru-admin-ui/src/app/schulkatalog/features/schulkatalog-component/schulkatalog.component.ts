import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SchulkatalogFacade } from '../../api/schulkatalog.facade';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { LaenderListComponent } from '../laender-list-component/laender-list.component';
import { OrteListComponent } from '../orte-list-component/orte-list.component';
import { SchulenListComponent } from '../schulen-list-component/schulen-list.component';

@Component({
    selector: 'mk-admin-schulkatalog',
    imports: [LaenderListComponent, OrteListComponent, SchulenListComponent],
    templateUrl: './schulkatalog.component.html',
    styleUrl: './schulkatalog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchulkatalogComponent {
    private readonly facade = inject(SchulkatalogFacade);

    readonly laender = this.facade.laender;
    readonly isLaenderLoaded = this.facade.isLaenderLoaded;
    readonly selectedLand = this.facade.selectedLand;
    readonly nameSelectedLand = this.facade.nameSelectedLand;

    readonly orte = this.facade.orte;
    readonly isOrteLoaded = this.facade.isOrteLoaded;
    readonly selectedOrt = this.facade.selectedOrt;
    readonly beschreibungSelectedOrt = this.facade.beschreibungSelectedOrt;

    readonly schulen = this.facade.schulen;
    readonly isSchulenLoaded = this.facade.isSchulenLoaded;

    onLandSelected(land: Land): void {
        this.facade.landSelected(land);
    }

    onOrtSelected(ort: Ort): void {
        this.facade.ortSelected(ort);
    }

    onSchuleSelected(schule: Schule): void {
        this.facade.schuleSelected(schule);
    }
}
