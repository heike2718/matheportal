import { Action } from '@ngrx/store';
import { SchulkatalogDialogEffects } from './schulkatalog-dialog.effects';
import { firstValueFrom, Subject } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
    initialOrtMitSchuleAnlegenRequest,
    initialSchuleAnlegenOderAendernRequest,
    Land,
    LandMitOrtUndSchuleAnlegenRequest,
    Ort,
    OrtMitSchuleAnlegenRequest,
    Schule,
    SchuleAnlegenOderAendernRequest,
} from '../model/schulkatalog.model';
import { Dialog } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { schulkatalogActions } from '../data/+state/schulkatalog.actions';
import { fromSchulkatalog } from '../data/+state/schulkatalog.selectors';
import { OrtMitSchuleAnlegenDialogComponent } from './ort-mit-schule-anlegen-dialog-component/ort-mit-schule-anlegen-dialog.component';
import { SchuleDialogComponent } from './schule-dialog-component/schule-dialog.component';

describe('SchulkatalogDialogEffects', () => {
    const emailAuftraggeber = 'test@provider.de';
    const kuerzelLand = 'AU';
    const nameLand = 'Österreich';
    const nameOrt = 'Wien';
    const nameSchule = 'Testschule';

    let action$: Subject<Action>;
    let effects: SchulkatalogDialogEffects;

    let store: MockStore;

    const dialogMock = {
        open: vi.fn(),
    };

    beforeEach(() => {
        action$ = new Subject<Action>();

        TestBed.configureTestingModule({
            providers: [
                SchulkatalogDialogEffects,
                provideMockActions(() => action$),
                provideMockStore(),
                {
                    provide: Dialog,
                    useValue: dialogMock,
                },
            ],
        });

        effects = TestBed.inject(SchulkatalogDialogEffects);
        store = TestBed.inject(MockStore);

        vi.clearAllMocks();
    });

    describe('landMitOrtUndSchuleAnlegenSelected$', () => {
        const result: LandMitOrtUndSchuleAnlegenRequest = {
            emailAuftraggeber,
            kuerzelLand,
            nameLand,
            nameOrt,
            nameSchule,
        };

        let closed$: Subject<LandMitOrtUndSchuleAnlegenRequest>;

        beforeEach(() => {
            closed$ = new Subject<LandMitOrtUndSchuleAnlegenRequest>();

            dialogMock.open.mockReturnValue({
                closed: closed$,
            });
        });

        it('should open a dialog and dispatch landMitOrtUndSchuleAnlegen when closed', async () => {
            // arrange
            const promise = firstValueFrom(effects.landMitOrtUndSchuleAnlegenSelected$);

            // act
            action$.next(schulkatalogActions.landMitOrtUndSchuleAnlegenSelected());
            closed$.next(result);

            const emitted = await promise;

            // assert
            expect(emitted).toEqual(schulkatalogActions.landMitOrtUndSchuleAnlegen({ payload: result }));
        });
    });

    describe('ortMitSchuleAnlegenSelected$', () => {
        const selectedLand: Land = {
            kuerzel: kuerzelLand,
            name: nameLand,
            anzahlOrte: 6,
        };

        let closed$: Subject<OrtMitSchuleAnlegenRequest>;

        beforeEach(() => {
            closed$ = new Subject<OrtMitSchuleAnlegenRequest>();

            dialogMock.open.mockReturnValue({
                closed: closed$,
            });
        });

        it('should dispatch ortMitSchuleAnlegen with selected land and dialog result', async () => {
            const result: OrtMitSchuleAnlegenRequest = {
                emailAuftraggeber,
                nameOrt,
                nameSchule,
            };

            store.overrideSelector(fromSchulkatalog.selectSelectedLand, selectedLand);
            store.refreshState();

            const closed$ = new Subject<OrtMitSchuleAnlegenRequest>();

            dialogMock.open.mockReturnValue({
                closed: closed$,
            });

            const promise = firstValueFrom(effects.ortMitSchuleAnlegenSelected$);

            action$.next(schulkatalogActions.ortMitSchuleAnlegenSelected());

            closed$.next(result);

            const emitted = await promise;

            expect(emitted).toEqual(
                schulkatalogActions.ortMitSchuleAnlegen({
                    land: selectedLand,
                    payload: result,
                })
            );

            expect(dialogMock.open).toHaveBeenCalledWith(OrtMitSchuleAnlegenDialogComponent, {
                width: '500px',
                data: {
                    land: selectedLand,
                    payload: initialOrtMitSchuleAnlegenRequest,
                },
            });
        });

        it('should not open a dialog and not emit an action when selectedLand is undefined', async () => {
            store.overrideSelector(fromSchulkatalog.selectSelectedLand, undefined);
            store.refreshState();

            const next = vi.fn();

            const subscription = effects.ortMitSchuleAnlegenSelected$.subscribe(next);

            action$.next(schulkatalogActions.ortMitSchuleAnlegenSelected());

            expect(next).not.toHaveBeenCalled();
            expect(dialogMock.open).not.toHaveBeenCalled();

            subscription.unsubscribe();
        });
    });

    describe('schuleAnlegenSelected$', () => {
        const land: Land = {
            kuerzel: kuerzelLand,
            name: nameLand,
            anzahlOrte: 6,
        };

        let closed$: Subject<SchuleAnlegenOderAendernRequest>;

        beforeEach(() => {
            closed$ = new Subject<SchuleAnlegenOderAendernRequest>();

            dialogMock.open.mockReturnValue({
                closed: closed$,
            });
        });

        it('should dispatch schuleAnlegen with selected ort and dialog result', async () => {
            const selectedOrt: Ort = {
                land,
                kuerzel: 'A1234567',
                name: nameOrt,
                anzahlSchulen: 54,
            };

            const result: SchuleAnlegenOderAendernRequest = {
                emailAuftraggeber,
                name: nameSchule,
            };

            store.overrideSelector(fromSchulkatalog.selectSelectedOrt, selectedOrt);
            store.refreshState();

            const closed$ = new Subject<SchuleAnlegenOderAendernRequest>();

            dialogMock.open.mockReturnValue({
                closed: closed$,
            });

            const promise = firstValueFrom(effects.schuleAnlegenSelected$);

            action$.next(schulkatalogActions.schuleAnlegenSelected());

            closed$.next(result);

            const emitted = await promise;

            expect(emitted).toEqual(
                schulkatalogActions.schuleAnlegen({
                    ort: selectedOrt,
                    payload: result,
                })
            );

            expect(dialogMock.open).toHaveBeenCalledWith(SchuleDialogComponent, {
                width: '500px',
                data: {
                    ort: selectedOrt,
                    payload: initialSchuleAnlegenOderAendernRequest,
                    submitButtonLabel: 'anlegen',
                },
            });
        });

        it('should not open a dialog and not emit an action when selectedOrt is undefined', async () => {
            store.overrideSelector(fromSchulkatalog.selectSelectedOrt, undefined);
            store.refreshState();

            const next = vi.fn();

            const subscription = effects.schuleAnlegenSelected$.subscribe(next);

            action$.next(schulkatalogActions.schuleAnlegenSelected());

            expect(next).not.toHaveBeenCalled();
            expect(dialogMock.open).not.toHaveBeenCalled();

            subscription.unsubscribe();
        });
    });

    describe('schuleUmbenennenSelected$', () => {
        const land: Land = {
            kuerzel: kuerzelLand,
            name: nameLand,
            anzahlOrte: 6,
        };

        const ort: Ort = {
            land,
            kuerzel: 'A1234567',
            name: nameOrt,
            anzahlSchulen: 13,
        };

        const selectedSchule: Schule = {
            ort,
            kuerzel: 'Z7654321',
            name: 'Testschule',
        };

        let closed$: Subject<SchuleAnlegenOderAendernRequest>;

        beforeEach(() => {
            closed$ = new Subject<SchuleAnlegenOderAendernRequest>();

            dialogMock.open.mockReturnValue({
                closed: closed$,
            });
        });

        it('should dispatch schuleUmbenennen with selected schule and dialog result', async () => {
            const result: SchuleAnlegenOderAendernRequest = {
                emailAuftraggeber,
                name: nameSchule,
            };

            store.overrideSelector(fromSchulkatalog.selectSelectedSchule, selectedSchule);
            store.refreshState();

            const closed$ = new Subject<SchuleAnlegenOderAendernRequest>();

            dialogMock.open.mockReturnValue({
                closed: closed$,
            });

            const promise = firstValueFrom(effects.schuleUmbenennenSelected$);

            action$.next(schulkatalogActions.schuleUmbenennenSelected({ schule: selectedSchule }));

            closed$.next(result);

            const emitted = await promise;

            expect(emitted).toEqual(
                schulkatalogActions.schuleUmbenennen({
                    schule: selectedSchule,
                    payload: result,
                })
            );

            expect(dialogMock.open).toHaveBeenCalledWith(SchuleDialogComponent, {
                width: '500px',
                data: {
                    ort: ort,
                    payload: { emailAuftraggeber: '', name: 'Testschule' },
                    submitButtonLabel: 'umbenennen',
                },
            });
        });

        it('should not open a dialog and not emit an action when selectedSchule is undefined', async () => {
            store.overrideSelector(fromSchulkatalog.selectSelectedSchule, undefined);
            store.refreshState();

            const next = vi.fn();

            const subscription = effects.schuleUmbenennenSelected$.subscribe(next);

            action$.next(schulkatalogActions.schuleUmbenennenSelected({ schule: selectedSchule }));

            expect(next).not.toHaveBeenCalled();
            expect(dialogMock.open).not.toHaveBeenCalled();

            subscription.unsubscribe();
        });
    });
});
