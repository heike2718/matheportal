import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    output,
    signal,
} from '@angular/core';
import { Ort } from '../../model/schulkatalog.model';
import { debounce, form, FormField, pattern } from '@angular/forms/signals';
import { OrtCardComponent } from '../ort-card-component/ort-card.component';
import {
    MINIKAENGURU_TEXT_PATTERN,
    MINIKAENGURU_TEXT_UNSUPPORTED_CHARACTERS_PATTERN,
    MINIKAENGURU_TEXT_VALIDATION_HINT,
} from '@matheportal/shared-utils';

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
        pattern(path.term, MINIKAENGURU_TEXT_PATTERN, {
            message: 'Der Suchbegriff enthält nicht erlaubte Zeichen.',
        });
    });

    readonly validationHint = MINIKAENGURU_TEXT_VALIDATION_HINT;

    protected readonly unsupportedCharacters = computed(() => [
        ...new Set(this.componentModel().term.match(MINIKAENGURU_TEXT_UNSUPPORTED_CHARACTERS_PATTERN) ?? []),
    ]);

    protected readonly showTermError = computed(
        () => this.searchForm.term().dirty() && this.searchForm.term().invalid()
    );

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

            if (!this.searchForm.term().valid()) {
                return;
            }

            if (term === this.previousTerm) {
                return;
            }

            this.previousTerm = term;
            this.searchTermOrtChanged.emit(term);
        });
    }
}
