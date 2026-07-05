import { inject, Injectable } from '@angular/core';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { WettbewerbsdurchfuehrendeHttpService } from '../wettbewerbsdurchfuehrende-http.service';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { WettbewerbsdurchfuehrenderDto } from '../../model/wettbewerbsdurchfuehrende.model';
import { TECHNISCHER_FEHLER_MESSAGE } from '@matheportal/shared-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { mapErrorToMessage } from '../../../error/minikaenguru-error-mapper';

@Injectable()
export class WettbewerbsdurchfuehrendeEffects {
    #actions = inject(Actions);
    #messagePublisher = inject(MESSAGE_PUBLISHER);
    #httpService = inject(WettbewerbsdurchfuehrendeHttpService);
    #router = inject(Router);

    durchfuehrendenAnlegen$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen),
            exhaustMap(({ requestDto }) =>
                this.#httpService.createWettbewerbsdurchfuehrenden(requestDto).pipe(
                    map((responseDto: WettbewerbsdurchfuehrenderDto) =>
                        wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto })
                    ),
                    catchError((error: Error) =>
                        of(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error }))
                    )
                )
            )
        );
    });

    durchfuehrendenAnlegenFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed),
                tap(action => {
                    const errorMessage = mapErrorToMessage(action.error);
                    this.#messagePublisher.publishError(errorMessage);
                })
            ),
        { dispatch: false }
    );

    durchfuehrenderAngelegt$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt),
                tap(({ responseDto }) => {
                    switch (responseDto.durchfuehrungsart) {
                        case 'PRIVAT':
                            this.#router.navigateByUrl('/minikaenguru-anwendung/dashboard-privatperson');
                            break;
                        case 'SCHULE':
                            this.#router.navigateByUrl('/minikaenguru-anwendung/dashboard-lehrperson');
                            break;
                        default:
                            // dieser Fall ist nur möglich, wenn eine weitere DURCHFUEHRUNGSART hinzugefügt wird.
                            throw new Error(
                                `unbekannte DURCHFUEHRUNGSART $responseDto.durchfuehrungsart beim Anlegen eines Durchführenden`
                            );
                    }
                })
            ),
        { dispatch: false }
    );
}
