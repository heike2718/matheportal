import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuswertungsartDialogComponent } from './auswertungsart-dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AuswertungsartDialogData, AUSWERUNGSART } from '../../../teilnahmen/model/teilnahme.model';
import { By } from '@angular/platform-browser';

describe('AuswertungsartDialogComponent', () => {
    let fixture: ComponentFixture<AuswertungsartDialogComponent>;

    const dialogRefMock = {
        close: vi.fn(),
    };

    async function setup(data: AuswertungsartDialogData) {
        await TestBed.configureTestingModule({
            imports: [AuswertungsartDialogComponent],
            providers: [
                {
                    provide: DIALOG_DATA,
                    useValue: data,
                },
                {
                    provide: DialogRef,
                    useValue: dialogRefMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AuswertungsartDialogComponent);
        await fixture.whenStable();
    }

    describe('aktuelle auswertungsart undefined', () => {
        const data: AuswertungsartDialogData = {
            auswertungsart: undefined,
            schulkuerzel: 'S1234567',
            loesungszettelVorhanden: false,
        };

        it('should show the expected title, introduction and options', async () => {
            await setup(data);

            const titleDe = fixture.debugElement.query(By.css('.auswertungsart-dialog__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Auswertungsart wählen');

            const introductionAuswertungsartUndefinedDe = fixture.debugElement.query(
                By.css('[data-testid="inroduction-auswertungsart-undefined"]')
            );
            expect(introductionAuswertungsartUndefinedDe).toBeTruthy();

            const introductionAuswertungsartDefinedDe = fixture.debugElement.query(
                By.css('[data-testid="inroduction-auswertungsart-defined"]')
            );
            expect(introductionAuswertungsartDefinedDe).toBe(null);

            const optionOnlineDe = fixture.debugElement.query(By.css('[data-testid="option-online"]'));
            expect(optionOnlineDe).toBeTruthy();

            const btnOnlineDe = fixture.debugElement.query(By.css('[data-testid="btn-online"]'));
            expect(btnOnlineDe.nativeElement.textContent.trim()).toBe('Online-Auswertung wählen');

            const optionOfflineDe = fixture.debugElement.query(By.css('[data-testid="option-offline"]'));
            expect(optionOfflineDe).toBeTruthy();

            const btnOfflineDe = fixture.debugElement.query(By.css('[data-testid="btn-offline"]'));
            expect(btnOfflineDe.nativeElement.textContent.trim()).toBe('Offline-Auswertung wählen');

            const btnCancelDe = fixture.debugElement.query(By.css('[data-testid="btn-cancel"]'));
            expect(btnCancelDe.nativeElement.textContent.trim()).toBe('Abbrechen');
        });

        it('should close with auswertungsart online when button online is clicked', async () => {
            await setup(data);

            const btnOnlineDe = fixture.debugElement.query(By.css('[data-testid="btn-online"]'));
            btnOnlineDe.triggerEventHandler('click');

            expect(dialogRefMock.close).toHaveBeenCalledWith({
                schulkuerzel: 'S1234567',
                gewaehlteAuswertungsart: AUSWERUNGSART.online,
            });
        });

        it('should close with auswertungsart offline when button offline is clicked', async () => {
            await setup(data);

            const btnOfflineDe = fixture.debugElement.query(By.css('[data-testid="btn-offline"]'));
            btnOfflineDe.triggerEventHandler('click');

            expect(dialogRefMock.close).toHaveBeenCalledWith({
                schulkuerzel: 'S1234567',
                gewaehlteAuswertungsart: AUSWERUNGSART.offline,
            });
        });

        it('should close with undefined result when button canlel is clicked', async () => {
            await setup(data);

            const btnCancelDe = fixture.debugElement.query(By.css('[data-testid="btn-cancel"]'));
            btnCancelDe.triggerEventHandler('click');

            expect(dialogRefMock.close).toHaveBeenCalledWith(undefined);
        });
    });

    describe('aktuelle auswertungsart online', () => {
        const data: AuswertungsartDialogData = {
            auswertungsart: AUSWERUNGSART.online,
            schulkuerzel: 'S1234567',
            loesungszettelVorhanden: false,
        };

        it('should show the expected when loesungszettelVorhanden false', async () => {
            await setup(data);

            const titleDe = fixture.debugElement.query(By.css('.auswertungsart-dialog__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Auswertungsart ändern');

            const textAktuelleAuswertungsartDe = fixture.debugElement.query(
                By.css('[data-testid="text-aktuelle-auswertungsart"]')
            );
            expect(textAktuelleAuswertungsartDe.nativeElement.textContent.trim()).toBe(
                'Aktuell ist diese Schule ist für die Online-Auswertung registriert.'
            );

            const textScopeOnlineDe = fixture.debugElement.query(By.css('[data-testid="text-scope-online"]'));
            expect(textScopeOnlineDe).toBe(null);

            const textScopeOfflineDe = fixture.debugElement.query(By.css('[data-testid="text-scope-offline"]'));
            expect(textScopeOfflineDe).toBe(null);

            const optionOnlineDe = fixture.debugElement.query(By.css('[data-testid="option-online"]'));
            expect(optionOnlineDe).toBe(null);

            const optionOfflineTitleDe = fixture.debugElement.query(By.css('.auswertungsart-dialog__option-title'));
            expect(optionOfflineTitleDe.nativeElement.textContent.trim()).toBe(
                'Offline – Auswertung mit Excel- und Urkundenvorlagen'
            );

            const optionDescriptions = fixture.debugElement.queryAll(
                By.css('.auswertungsart-dialog__option-description')
            );
            expect(optionDescriptions.length).toBe(2);
            expect(optionDescriptions[0].nativeElement.textContent.trim()).toContain(
                'In der Minikänguru-Anwendung erfassen wir keine Klassen, Kinder oder Lösungszettel.'
            );
            expect(optionDescriptions[1].nativeElement.textContent.trim()).toContain('statistische Auswertung');

            const optionOfflineWarningDe = fixture.debugElement.query(By.css('.auswertungsart-dialog__warning'));
            expect(optionOfflineWarningDe).toBe(null);

            const btnOfflineDe = fixture.debugElement.query(By.css('[data-testid="btn-offline"]'));
            expect(btnOfflineDe.nativeElement.textContent.trim()).toBe('Offline-Auswertung wählen');

            const btnCancelDe = fixture.debugElement.query(By.css('[data-testid="btn-cancel"]'));
            expect(btnCancelDe.nativeElement.textContent.trim()).toBe('Abbrechen');
        });

        it('should show the expected when loesungszettelVorhanden true', async () => {
            await setup({ ...data, loesungszettelVorhanden: true });

            const textScopeOnlineDe = fixture.debugElement.query(By.css('[data-testid="text-scope-online"]'));
            expect(textScopeOnlineDe).not.toBe(null);

            const textScopeOfflineDe = fixture.debugElement.query(By.css('[data-testid="text-scope-offline"]'));
            expect(textScopeOfflineDe).toBe(null);

            const optionOnlineDe = fixture.debugElement.query(By.css('[data-testid="option-online"]'));
            expect(optionOnlineDe).toBe(null);

            const optionOfflineWarningDe = fixture.debugElement.query(By.css('.auswertungsart-dialog__warning'));
            expect(optionOfflineWarningDe).not.toBe(null);

            const btnOfflineDe = fixture.debugElement.query(By.css('[data-testid="btn-offline"]'));
            expect(btnOfflineDe.nativeElement.textContent.trim()).toBe(
                'Klassen und Kinder löschen und offline auswerten'
            );

            const btnCancelDe = fixture.debugElement.query(By.css('[data-testid="btn-cancel"]'));
            expect(btnCancelDe.nativeElement.textContent.trim()).toBe('Abbrechen');
        });
    });

    describe('aktuelle auswertungsart offline', () => {
        const data: AuswertungsartDialogData = {
            auswertungsart: AUSWERUNGSART.offline,
            schulkuerzel: 'S1234567',
            loesungszettelVorhanden: false,
        };

        it('should show the expected when loesungszettelVorhanden false', async () => {
            await setup(data);

            const titleDe = fixture.debugElement.query(By.css('.auswertungsart-dialog__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Auswertungsart ändern');

            const textAktuelleAuswertungsartDe = fixture.debugElement.query(
                By.css('[data-testid="text-aktuelle-auswertungsart"]')
            );
            expect(textAktuelleAuswertungsartDe.nativeElement.textContent.trim()).toBe(
                'Aktuell ist diese Schule ist für die Offline-Auswertung registriert.'
            );

            const textScopeOnlineDe = fixture.debugElement.query(By.css('[data-testid="text-scope-online"]'));
            expect(textScopeOnlineDe).toBe(null);

            const textScopeOfflineDe = fixture.debugElement.query(By.css('[data-testid="text-scope-offline"]'));
            expect(textScopeOfflineDe).toBe(null);

            const optionOfflineDe = fixture.debugElement.query(By.css('[data-testid="option-offline"]'));
            expect(optionOfflineDe).toBe(null);

            const optionOnlineTitleDe = fixture.debugElement.query(By.css('.auswertungsart-dialog__option-title'));
            expect(optionOnlineTitleDe.nativeElement.textContent.trim()).toBe(
                'Online – Auswertung durch die Minikänguru-Anwendung'
            );

            const optionDescriptions = fixture.debugElement.queryAll(
                By.css('.auswertungsart-dialog__option-description')
            );
            expect(optionDescriptions.length).toBe(1);
            expect(optionDescriptions[0].nativeElement.textContent.trim()).toContain(
                'Die Anwendung übernimmt die Auswertung'
            );

            const btnCancelDe = fixture.debugElement.query(By.css('[data-testid="btn-cancel"]'));
            expect(btnCancelDe.nativeElement.textContent.trim()).toBe('Abbrechen');
        });

        it('should show the expected when loesungszettelVorhanden true', async () => {
            await setup({ ...data, loesungszettelVorhanden: true });

            const titleDe = fixture.debugElement.query(By.css('.auswertungsart-dialog__title'));
            expect(titleDe.nativeElement.textContent.trim()).toBe('Auswertungsart ändern');

            const textAktuelleAuswertungsartDe = fixture.debugElement.query(
                By.css('[data-testid="text-aktuelle-auswertungsart"]')
            );
            expect(textAktuelleAuswertungsartDe.nativeElement.textContent.trim()).toBe(
                'Aktuell ist diese Schule ist für die Offline-Auswertung registriert.'
            );

            const textScopeOfflineDe = fixture.debugElement.query(By.css('[data-testid="text-scope-offline"]'));
            expect(textScopeOfflineDe.nativeElement.textContent.trim()).toContain(
                'Sie haben bereits Lösungszettel für den aktuellen Wettbewern hochgeladen.'
            );

            const optionOfflineDe = fixture.debugElement.query(By.css('[data-testid="option-offline"]'));
            expect(optionOfflineDe).toBe(null);

            const optionOnlineTitleDe = fixture.debugElement.query(By.css('.auswertungsart-dialog__option-title'));
            expect(optionOnlineTitleDe).toBe(null);

            const btnCancelDe = fixture.debugElement.query(By.css('[data-testid="btn-cancel"]'));
            expect(btnCancelDe.nativeElement.textContent.trim()).toBe('Abbrechen');
        });
    });
});
