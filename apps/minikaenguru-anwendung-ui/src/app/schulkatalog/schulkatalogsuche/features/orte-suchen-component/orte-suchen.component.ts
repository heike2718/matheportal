import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    input,
    output,
    signal,
    untracked,
} from '@angular/core';
import { Ort } from '../../model/schulkatalog.model';
import { debounce, form, FormField } from '@angular/forms/signals';
import { OrtCardComponent } from '../ort-card-component/ort-card.component';

@Component({
    selector: 'mka-orte-suchen',
    imports: [FormField, OrtCardComponent],
    templateUrl: './orte-suchen.component.html',
    styleUrl: './orte-suchen.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrteSuchenComponent implements AfterViewInit {
    private previousTerm = '';

    protected readonly componentModel = signal<{ term: string }>({
        term: '',
    });

    protected readonly searchForm = form(this.componentModel, path => {
        debounce(path.term, 300);
    });

    readonly searchTermOrtChanged = output<string>();

    readonly orte = input.required<Ort[]>();

    readonly orteLoaded = input.required<boolean>();

    readonly ortSelected = output<Ort>();

    constructor() {
        this.registerSearchTermEffect();
    }

    ngAfterViewInit(): void {
        this.searchForm.term().focusBoundControl();
    }

    private registerSearchTermEffect(): void {
        effect(() => {
            const term = this.searchForm.term().value().trim();

            if (term === this.previousTerm) {
                return;
            }

            this.previousTerm = term;
            this.searchTermOrtChanged.emit(term);
        });
    }
}
