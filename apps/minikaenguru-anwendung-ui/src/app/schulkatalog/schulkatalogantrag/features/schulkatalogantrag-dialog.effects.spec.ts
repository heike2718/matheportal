import { firstValueFrom, Subject, toArray } from 'rxjs';
import { Schulkatalogantrag } from '../model/schulkatalogantrag.model';
import { Action } from '@ngrx/store';
import { SchulkatalogantragDialogEffects } from './schulkatalogantrag-dialog.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Dialog } from '@angular/cdk/dialog';
import { schulkatalogsucheActions } from '../../schulkatalogsuche/data/+state/schulkatalogsuche.actions';
import { schulkatalogantragActions } from '../data/+state/schulkatalogantrag.actions';

describe('SchulkatalogantragDialogEffects', () => {
    const antrag: Schulkatalogantrag = {
        emailAuftraggeber: 'test@provider.de',
        nameLand: 'Schweiz',
        nameOrt: 'Winterthur',
        nameSchule: 'Primarschule Kirchgässli',
        plz: '7645',
        strasseUndHausnummer: 'Kirchgässli 12',
    };

    let action$: Subject<Action>;
    let effects: SchulkatalogantragDialogEffects;

    const dialogMock = {
        open: vi.fn(),
    };

    beforeEach(() => {
        action$ = new Subject<Action>();

        TestBed.configureTestingModule({
            providers: [
                SchulkatalogantragDialogEffects,
                provideMockActions(() => action$),
                {
                    provide: Dialog,
                    useValue: dialogMock,
                },
            ],
        });

        effects = TestBed.inject(SchulkatalogantragDialogEffects);

        vi.clearAllMocks();
    });

    describe('submitSchulkatalogantragRequested$', () => {
        let closed$: Subject<Schulkatalogantrag>;

        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should open a dialog and dispatch submitSchulkatalogantrag when closed', async () => {
            // arrange
            closed$ = new Subject<Schulkatalogantrag>();

            dialogMock.open.mockReturnValue({
                closed: closed$,
            });

            const promise = firstValueFrom(effects.submitSchulkatalogantragRequested$);

            // act
            action$.next(schulkatalogsucheActions.submitSchulkatalogantragRequested());
            closed$.next(antrag);

            const emitted = await promise;

            // assert
            expect(emitted).toEqual(schulkatalogantragActions.submitSchulkatalogantrag({ antrag }));
        });

        it('should open a dialog but not dispatch any action when cancelled', async () => {
            // arrange
            const cancelled$ = new Subject<Schulkatalogantrag | undefined>();

            dialogMock.open.mockReturnValue({
                closed: cancelled$,
            });

            const promise = firstValueFrom(effects.submitSchulkatalogantragRequested$.pipe(toArray()));

            // act
            action$.next(schulkatalogsucheActions.submitSchulkatalogantragRequested());
            cancelled$.next(undefined);
            cancelled$.complete();
            action$.complete();

            const emitted = await promise;

            // assert
            expect(dialogMock.open).toHaveBeenCalledTimes(1);
            expect(emitted).toEqual([]);
        });
    });
});
