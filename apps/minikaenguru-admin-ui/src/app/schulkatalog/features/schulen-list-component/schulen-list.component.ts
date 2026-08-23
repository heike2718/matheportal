import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Schule } from '../../model/schulkatalog.model';
import { debounce, form, FormField } from '@angular/forms/signals';
import { SchuleCardComponent } from '../schule-card-component/schule-card.component';

@Component({
    selector: 'mk-admin-schulen-list',
    imports: [FormField, SchuleCardComponent],
    templateUrl: './schulen-list.component.html',
    styleUrl: './schulen-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchulenListComponent {
    readonly selectedOrt = input.required<string>();
    readonly schulen = input.required<Schule[]>();
    readonly schulenLoaded = input.required<boolean>();

    readonly schuleSelected = output<Schule>();

    protected readonly componentModel = signal<{ term: string }>({
        term: '',
    });

    protected readonly searchForm = form(this.componentModel, path => {
        debounce(path.term, 300);
    });

    protected readonly filteredSchulen = computed(() => {
        const term = this.componentModel().term.trim().toLocaleLowerCase('de');

        if (!term) {
            return this.schulen();
        }

        return this.schulen().filter(schule => schule.name.toLocaleLowerCase('de').includes(term));
    });

    constructor() {
        this.registerSearchInputFocusEffect();
    }

    private registerSearchInputFocusEffect(): void {
        afterRenderEffect({
            write: () => {
                if (this.schulenLoaded()) {
                    this.searchForm.term().focusBoundControl();
                }
            },
        });
    }
}
