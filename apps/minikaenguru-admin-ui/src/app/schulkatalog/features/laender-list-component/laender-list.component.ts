import { AfterViewInit, ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Land } from '../../model/schulkatalog.model';
import { debounce, form, FormField } from '@angular/forms/signals';
import { LandCardComponent } from '../land-card-component/land-card.component';

@Component({
    selector: 'mk-admin-laender-list',
    imports: [FormField, LandCardComponent],
    templateUrl: './laender-list.component.html',
    styleUrl: './laender-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaenderListComponent implements AfterViewInit {
    readonly laender = input.required<Land[]>();
    readonly laenderLoaded = input.required<boolean>();

    readonly landSelected = output<Land>();

    protected readonly componentModel = signal<{ term: string }>({
        term: '',
    });

    protected readonly searchForm = form(this.componentModel, path => {
        debounce(path.term, 300);
    });

    protected readonly filteredLaender = computed(() => {
        const term = this.componentModel().term.trim().toLocaleLowerCase('de');

        if (!term) {
            return this.laender();
        }

        return this.laender().filter(land => land.name.toLocaleLowerCase('de').startsWith(term));
    });

    ngAfterViewInit(): void {
        this.searchForm.term().focusBoundControl();
    }
}
