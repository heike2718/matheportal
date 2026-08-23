import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { OrtCardComponent } from '../ort-card-component/ort-card.component';
import { Ort } from '../../model/schulkatalog.model';

@Component({
    selector: 'mk-admin-orte-list',
    imports: [FormField, OrtCardComponent],
    templateUrl: './orte-list.component.html',
    styleUrl: './orte-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrteListComponent {
    readonly selectedLand = input.required<string>();
    readonly orte = input.required<Ort[]>();
    readonly orteLoaded = input.required<boolean>();

    readonly ortSelected = output<Ort>();
    readonly backToLaenderRequested = output<void>();

    protected readonly componentModel = signal<{ term: string }>({
        term: '',
    });

    protected readonly searchForm = form(this.componentModel, path => {
        debounce(path.term, 300);
    });

    protected readonly filteredOrte = computed(() => {
        const term = this.componentModel().term.trim().toLocaleLowerCase('de');

        if (!term) {
            return this.orte();
        }

        return this.orte().filter(ort => ort.name.toLocaleLowerCase('de').startsWith(term));
    });

    constructor() {
        this.registerSearchInputFocusEffect();
    }

    private registerSearchInputFocusEffect(): void {
        afterRenderEffect({
            write: () => {
                if (this.orteLoaded()) {
                    this.searchForm.term().focusBoundControl();
                }
            },
        });
    }
}
