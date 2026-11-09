import { HttpClient, HttpContext } from '@angular/common/http';
import { WettbewerbHttpService } from './wettbewerb-http.service';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { TestBed } from '@angular/core/testing';
import { paths } from '../../../generated/api-types';
import { Wettbewerb } from '../model/wettbewerb.model';
import { of } from 'rxjs';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';

describe('WettbewerbHttpService', () => {
    it('loadWettbewerb ruft den vereinbarten Pfad mit GET auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/wettbewerb' satisfies keyof paths;

        const wettbewerb: Wettbewerb = {
            beginn: '01.01.2027',
            ende: '31.07.2027',
            freischaltungPrivat: '15.06.2027',
            freischaltungSchulen: '14.03.2027',
            jahr: 2027,
            status: 'ANMELDUNG',
        };

        const httpClientMock = {
            get: vi.fn().mockReturnValue(of(wettbewerb)),
        };

        TestBed.configureTestingModule({
            providers: [
                WettbewerbHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(WettbewerbHttpService);

        const subscription = service.loadWettbewerb().subscribe();

        try {
            expect(httpClientMock.get).toHaveBeenCalledExactlyOnceWith(
                apiUrl + expectedPath,
                expect.objectContaining({
                    context: expect.any(HttpContext),
                    withCredentials: true,
                })
            );

            const options = httpClientMock.get.mock.calls[0][1];

            expect(options.context.get(ERROR_MESSAGE_HANDLED_LOCALLY)).toBe(true);
        } finally {
            subscription.unsubscribe();
        }
    });
});
