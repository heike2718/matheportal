# Dialog: Für später zum spicken

## durchfuehrungsart-waehlen-dialog

### html (durchfuehrungsart-waehlen-dialog.component.html)

```html
<section class="durchfuehrungsart-dialog" aria-labelledby="durchfuehrungsart-dialog-title">
    <header class="durchfuehrungsart-dialog__header">
        <h2 id="durchfuehrungsart-dialog-title" class="durchfuehrungsart-dialog__title">Durchführungsart wählen</h2>

        <p class="durchfuehrungsart-dialog__intro">
            Sie sind angemeldet, haben aber noch kein Minikängurukonto. Bitte wählen Sie aus, wie Sie Minikänguru nutzen
            möchten.
        </p>
    </header>

    <div class="durchfuehrungsart-dialog__options" aria-label="Durchführungsart">
        <button
            type="button"
            class="durchfuehrungsart-dialog__option"
            data-testid="mka-durchfuehrungsart-schule"
            (click)="selectSchule()">
            <span class="durchfuehrungsart-dialog__option-title">Schule</span>
            <span class="durchfuehrungsart-dialog__option-text">
                Sie organisieren den Wettbewerb für eine oder mehrere Klassen einer Schule.
            </span>
        </button>

        <button
            type="button"
            class="durchfuehrungsart-dialog__option"
            data-testid="mka-durchfuehrungsart-privat"
            (click)="selectPrivat()">
            <span class="durchfuehrungsart-dialog__option-title">Privat</span>
            <span class="durchfuehrungsart-dialog__option-text">
                Sie lassen ein oder mehrere Kinder ohne Schule am Wettbewerb teilnehmen.
            </span>
        </button>
    </div>
</section>
```

### scss (durchfuehrungsart-waehlen-dialog.component.scss)

```css
/** referenzen: mp-brand(...) siehe libs/shared-ui-theme/src/lib/styles/_branding.scss */
@use 'mp-theme' as mp-theme;

:host {
    display: block;
    box-sizing: border-box;
    width: min(92vw, 40rem);
    max-width: 100%;
    max-height: 90vh;
    overflow: auto;
    background-color: mp-theme.$mp-color-surface;
    border-radius: mp-theme.$mp-radius-l;
    box-shadow: mp-theme.$mp-shadow-2;

    &:focus {
        outline: none;
    }
}

.durchfuehrungsart-dialog {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: mp-theme.$mp-space-5;
    padding: mp-theme.$mp-space-6;
    font-family: mp-theme.$mp-font-family;

    &__header {
        display: flex;
        flex-direction: column;
        gap: mp-theme.$mp-space-3;
    }

    &__title {
        margin: 0;
        color: mp-theme.mp-brand(minikaenguru);
        font-size: mp-theme.$mp-font-size-l;
        font-weight: 700;
        line-height: mp-theme.$mp-line-height-tight;
    }

    &__intro {
        margin: 0;
        font-size: mp-theme.$mp-font-size-m;
        line-height: mp-theme.$mp-line-height-normal;
    }

    &__options {
        display: grid;
        grid-template-columns: 1fr;
        gap: mp-theme.$mp-space-3;
    }

    &__option {
        display: flex;
        flex-direction: column;
        gap: mp-theme.$mp-space-2;
        width: 100%;
        padding: mp-theme.$mp-space-4;
        border: mp-theme.$mp-border-width solid mp-theme.$mp-border-color-interactive;
        border-radius: mp-theme.$mp-radius-m;
        background-color: mp-theme.$mp-color-surface;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition:
            background-color 140ms ease,
            border-color 140ms ease,
            box-shadow 140ms ease,
            transform 140ms ease;

        &:hover {
            border-color: mp-theme.$mp-border-color-interactive-hover;
            background-color: mp-theme.mp-brand-hover(minikaenguru);
            box-shadow: mp-theme.$mp-shadow-1;
        }

        &:focus-visible {
            outline: 3px solid mp-theme.mp-brand(minikaenguru);
            outline-offset: mp-theme.$mp-space-1;
            border-color: mp-theme.mp-brand(minikaenguru);
        }

        &:active {
            transform: translateY(1px);
        }

        &--secondary {
            background-color: mp-theme.$mp-color-surface-subtle;
        }
    }

    &__option-title {
        color: mp-theme.mp-brand(minikaenguru);
        font-size: mp-theme.$mp-font-size-m;
        font-weight: 700;
        line-height: mp-theme.$mp-line-height-tight;
    }

    &__option-text {
        font-size: mp-theme.$mp-font-size-s;
        line-height: mp-theme.$mp-line-height-normal;
    }
}

@media (width <= 480px) {
    :host {
        width: 92vw;
        max-height: 90vh;
        border-radius: mp-theme.$mp-radius-m;
    }

    .durchfuehrungsart-dialog {
        gap: mp-theme.$mp-space-4;
        padding: mp-theme.$mp-space-4;

        &__title {
            font-size: mp-theme.$mp-font-size-m;
        }

        &__intro {
            font-size: mp-theme.$mp-font-size-s;
        }

        &__option {
            padding: mp-theme.$mp-space-3;
        }

        &__option-title {
            font-size: mp-theme.$mp-font-size-m;
        }

        &__option-text {
            font-size: mp-theme.$mp-font-size-s;
        }
    }
}
```

### component (durchfuehrungsart-waehlen-dialog.component.ts)

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { GewaehlteDurchfuehrungsart } from '../durchfuehrungsart-waehlen/durchfuehrungsart-waehlen.model';

@Component({
    selector: 'mka-durchfuehrungsart-waehlen-dialog',
    imports: [DialogModule],
    templateUrl: './durchfuehrungsart-waehlen-dialog.component.html',
    styleUrl: './durchfuehrungsart-waehlen-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurchfuehrungsartWaehlenDialogComponent {
    readonly #dialogRef = inject(DialogRef) as DialogRef<GewaehlteDurchfuehrungsart>;

    selectSchule(): void {
        this.#close('schule');
    }

    selectPrivat(): void {
        this.#close('privat');
    }

    #close(durchfuehrungsart: GewaehlteDurchfuehrungsart): void {
        this.#dialogRef.close(durchfuehrungsart);
    }
}
```

### tests (durchfuehrungsart-waehlen-dialog.component.spec.ts)

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef } from '@angular/cdk/dialog';
import { DurchfuehrungsartWaehlenDialogComponent } from './durchfuehrungsart-waehlen-dialog.component';
import { By } from '@angular/platform-browser';
import { GEWAEHLTE_DURCHFUEHRUNGSART } from '../durchfuehrungsart-waehlen/durchfuehrungsart-waehlen.model';

describe('DurchfuehrungsartWaehlenDialogComponent', () => {
    let component: DurchfuehrungsartWaehlenDialogComponent;
    let fixture: ComponentFixture<DurchfuehrungsartWaehlenDialogComponent>;

    let dialogRefMock: {
        close: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        dialogRefMock = {
            close: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [DurchfuehrungsartWaehlenDialogComponent],
            providers: [{ provide: DialogRef, useValue: dialogRefMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(DurchfuehrungsartWaehlenDialogComponent);
        component = fixture.componentInstance;
    });

    it('should create and show the expected title and intro', () => {
        expect(component).toBeTruthy();

        const titleDe = fixture.debugElement.query(By.css('.durchfuehrungsart-dialog__title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Durchführungsart wählen');

        const introDe = fixture.debugElement.query(By.css('.durchfuehrungsart-dialog__intro'));
        expect(introDe.nativeElement.textContent.trim()).toBe(
            'Sie sind angemeldet, haben aber noch kein Minikängurukonto. Bitte wählen Sie aus, wie Sie Minikänguru nutzen möchten.'
        );

        expect(fixture.debugElement.query(By.css('.durchfuehrungsart-dialog__intro'))).toBeTruthy();
    });

    it('should show the option schule and call selectSchule when clicked', () => {
        expect(component).toBeTruthy();
        const optionDe = fixture.debugElement.query(By.css('[data-testid="mka-durchfuehrungsart-schule"]'));

        const titleDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Schule');

        const textDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-text'));
        expect(textDe).toBeTruthy();
        expect(textDe.nativeElement.textContent.trim()).toBe(
            'Sie organisieren den Wettbewerb für eine oder mehrere Klassen einer Schule.'
        );

        optionDe.triggerEventHandler('click');
        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith(GEWAEHLTE_DURCHFUEHRUNGSART.schule);
    });

    it('should show the option privat and call selectPrivat when clicked', () => {
        expect(component).toBeTruthy();
        const optionDe = fixture.debugElement.query(By.css('[data-testid="mka-durchfuehrungsart-privat"]'));

        const titleDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-title'));
        expect(titleDe.nativeElement.textContent.trim()).toBe('Privat');

        const textDe = optionDe.query(By.css('.durchfuehrungsart-dialog__option-text'));
        expect(textDe).toBeTruthy();
        expect(textDe.nativeElement.textContent.trim()).toBe(
            'Sie lassen ein oder mehrere Kinder ohne Schule am Wettbewerb teilnehmen.'
        );

        optionDe.triggerEventHandler('click');
        expect(dialogRefMock.close).toHaveBeenCalledOnce();
        expect(dialogRefMock.close).toHaveBeenCalledWith(GEWAEHLTE_DURCHFUEHRUNGSART.privat);
    });
});
```
