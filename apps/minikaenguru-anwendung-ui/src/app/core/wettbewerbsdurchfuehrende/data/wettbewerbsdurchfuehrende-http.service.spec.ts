import { of } from 'rxjs';
import {
    DURCHFUEHRUNGSART,
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderRequest,
} from '../model/wettbewerbsdurchfuehrende.model';
import { WettbewerbsdurchfuehrendeHttpService } from './wettbewerbsdurchfuehrende-http.service';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { paths } from '../../../generated/api-types';

describe('WettbewerbsdurchfuehrendeHttpService', () => {
    it('loadWettbewerbsdurchfuehrenden ruft den vereinbarten Pfad mit GET auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/wettbewerbsdurchfuehrende/konto' satisfies keyof paths;

        const wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender = {
            durchfuehrungsart: DURCHFUEHRUNGSART.privat,
            newsletter: false,
            zugangsberechtigungUnterlagen: 'STANDARD',
        };

        const httpClientMock = {
            get: vi.fn().mockReturnValue(of(wettbewerbsdurchfuehrender)),
        };

        TestBed.configureTestingModule({
            providers: [
                WettbewerbsdurchfuehrendeHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(WettbewerbsdurchfuehrendeHttpService);

        const subscription = service.loadWettbewerbsdurchfuehrenden().subscribe();

        try {
            expect(httpClientMock.get).toHaveBeenCalledExactlyOnceWith(
                apiUrl + expectedPath,
                expect.objectContaining({
                    withCredentials: true,
                })
            );
        } finally {
            subscription.unsubscribe();
        }
    });

    it('createWettbewerbsdurchfuehrenden ruft den vereinbarten Pfad mit POST auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/wettbewerbsdurchfuehrende/konto' satisfies keyof paths;

        const wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender = {
            durchfuehrungsart: DURCHFUEHRUNGSART.privat,
            newsletter: false,
            zugangsberechtigungUnterlagen: 'STANDARD',
        };

        const httpClientMock = {
            post: vi.fn().mockReturnValue(of(wettbewerbsdurchfuehrender)),
        };

        TestBed.configureTestingModule({
            providers: [
                WettbewerbsdurchfuehrendeHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(WettbewerbsdurchfuehrendeHttpService);

        const requestDto: WettbewerbsdurchfuehrenderRequest = {
            durchfuehrungsart: DURCHFUEHRUNGSART.privat,
        };

        const subscription = service.createWettbewerbsdurchfuehrenden(requestDto).subscribe();

        try {
            expect(httpClientMock.post).toHaveBeenCalledExactlyOnceWith(
                apiUrl + expectedPath,
                requestDto,
                expect.objectContaining({
                    withCredentials: true,
                })
            );
        } finally {
            subscription.unsubscribe();
        }
    });
});
