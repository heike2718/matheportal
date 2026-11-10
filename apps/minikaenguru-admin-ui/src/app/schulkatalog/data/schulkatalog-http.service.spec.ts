import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import type { paths } from '../../generated/api-types';
import { SchulkatalogHttpService } from './schulkatalog-http.service';
import { MINIKAENGURU_ADMIN_CONFIGURATION } from '../../config/minikaenguru-admin.configuration';
import {
    LandMitOrtUndSchuleAnlegenRequest,
    OrtMitSchuleAnlegenRequest,
    SchuleAnlegenOderAendernRequest,
    Schulkuerzel,
} from '../model/schulkatalog.model';

describe('SchulkatalogHttpService', () => {
    const schulkuerzel: Schulkuerzel = {
        kuerzel: 'S1234567',
    };

    describe('POST tests', () => {
        const apiUrl = 'https://example.test';
        const httpClientMock = {
            post: vi.fn().mockReturnValue(of(schulkuerzel)),
        };

        let service: SchulkatalogHttpService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    SchulkatalogHttpService,
                    { provide: HttpClient, useValue: httpClientMock },
                    {
                        provide: MINIKAENGURU_ADMIN_CONFIGURATION,
                        useValue: { apiUrl },
                    },
                ],
            });

            service = TestBed.inject(SchulkatalogHttpService);
            vi.clearAllMocks();
        });

        it('landMitOrtUndSchuleAnlegen ruft den vereinbarten Pfad mit POST auf', () => {
            const expectedPath = '/api/schulkatalog/schulen' satisfies keyof paths;

            const requestBody: LandMitOrtUndSchuleAnlegenRequest = {
                emailAuftraggeber: 'me@provider.de',
                kuerzelLand: 'RO',
                nameLand: 'Rumänien',
                nameOrt: 'Bukarest',
                nameSchule: 'Deutsche Schule Bukarest',
            };

            const subscription = service.landMitOrtUndSchuleAnlegen(requestBody).subscribe();

            try {
                expect(httpClientMock.post).toHaveBeenCalledExactlyOnceWith(
                    apiUrl + expectedPath,
                    {
                        emailAuftraggeber: 'me@provider.de',
                        kuerzelLand: 'RO',
                        nameLand: 'Rumänien',
                        nameOrt: 'Bukarest',
                        nameSchule: 'Deutsche Schule Bukarest',
                    },
                    expect.objectContaining({
                        withCredentials: true,
                    })
                );
            } finally {
                subscription.unsubscribe();
            }
        });

        it('ortMitSchuleInLandAnlegen ruft den vereinbarten Pfad mit POST auf', () => {
            const pathTemplate = '/api/schulkatalog/laender/{kuerzelLand}/schulen' satisfies keyof paths;

            const kuerzelLand = 'RO';
            const expectedPath = pathTemplate.replace('{kuerzelLand}', kuerzelLand);

            const requestBody: OrtMitSchuleAnlegenRequest = {
                emailAuftraggeber: 'me@provider.de',
                nameOrt: 'Bukarest',
                nameSchule: 'Deutsche Schule Bukarest',
            };

            const subscription = service.ortMitSchuleInLandAnlegen('RO', requestBody).subscribe();

            try {
                expect(httpClientMock.post).toHaveBeenCalledExactlyOnceWith(
                    apiUrl + expectedPath,
                    {
                        emailAuftraggeber: 'me@provider.de',
                        nameOrt: 'Bukarest',
                        nameSchule: 'Deutsche Schule Bukarest',
                    },
                    expect.objectContaining({
                        withCredentials: true,
                    })
                );
            } finally {
                subscription.unsubscribe();
            }
        });

        it('schuleInOrtAnlegen ruft den vereinbarten Pfad mit POST auf', () => {
            const pathTemplate = '/api/schulkatalog/orte/{kuerzelOrt}/schulen' satisfies keyof paths;

            const kuerzelOrt = 'R76RT9S3';
            const expectedPath = pathTemplate.replace('{kuerzelOrt}', kuerzelOrt);

            const requestBody: SchuleAnlegenOderAendernRequest = {
                emailAuftraggeber: 'me@provider.de',
                name: 'Deutsche Schule Bukarest',
            };

            const subscription = service.schuleInOrtAnlegen('R76RT9S3', requestBody).subscribe();

            try {
                expect(httpClientMock.post).toHaveBeenCalledExactlyOnceWith(
                    apiUrl + expectedPath,
                    {
                        emailAuftraggeber: 'me@provider.de',
                        name: 'Deutsche Schule Bukarest',
                    },
                    expect.objectContaining({
                        withCredentials: true,
                    })
                );
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('PUT tests', () => {
        const apiUrl = 'https://example.test';
        const httpClientMock = {
            put: vi.fn().mockReturnValue(of(schulkuerzel)),
        };

        let service: SchulkatalogHttpService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    SchulkatalogHttpService,
                    { provide: HttpClient, useValue: httpClientMock },
                    {
                        provide: MINIKAENGURU_ADMIN_CONFIGURATION,
                        useValue: { apiUrl },
                    },
                ],
            });

            service = TestBed.inject(SchulkatalogHttpService);
            vi.clearAllMocks();
        });

        it('schuleUmbenennen ruft den ruft den vereinbarten Pfad mit PUT auf', () => {
            const pathTemplate = '/api/schulkatalog/schulen/{kuerzel}' satisfies keyof paths;

            const kuerzelSchule = 'R76RT9S3';
            const expectedPath = pathTemplate.replace('{kuerzel}', kuerzelSchule);

            const requestBody: SchuleAnlegenOderAendernRequest = {
                emailAuftraggeber: 'me@provider.de',
                name: 'Deutsche Botschaftsschule Bukarest',
            };

            const subscription = service.schuleUmbenennen('R76RT9S3', requestBody).subscribe();

            try {
                expect(httpClientMock.put).toHaveBeenCalledExactlyOnceWith(
                    apiUrl + expectedPath,
                    {
                        emailAuftraggeber: 'me@provider.de',
                        name: 'Deutsche Botschaftsschule Bukarest',
                    },
                    expect.objectContaining({
                        withCredentials: true,
                    })
                );
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('GET tests', () => {
        const apiUrl = 'https://example.test';
        const httpClientMock = {
            get: vi.fn().mockReturnValue(of([])),
        };

        let service: SchulkatalogHttpService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    SchulkatalogHttpService,
                    { provide: HttpClient, useValue: httpClientMock },
                    {
                        provide: MINIKAENGURU_ADMIN_CONFIGURATION,
                        useValue: { apiUrl },
                    },
                ],
            });

            service = TestBed.inject(SchulkatalogHttpService);
            vi.clearAllMocks();
        });

        it('loadLaender ruft den vereinbarten Pfad mit GET auf', () => {
            const expectedPath = '/api/schulkatalog/laender' satisfies keyof paths;

            const subscription = service.loadLaender().subscribe();

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

        it('loadOrte ruft den vereinbarten Pfad mit GET auf', () => {
            const pathTemplate = '/api/schulkatalog/laender/{kuerzelLand}/orte' satisfies keyof paths;
            const kuerzelLand = 'RO';
            const expectedPath = pathTemplate.replace('{kuerzelLand}', kuerzelLand);

            const subscription = service.loadOrte(kuerzelLand).subscribe();

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

        it('loadSchulen ruft den vereinbarten Pfad mit GET auf', () => {
            const pathTemplate = '/api/schulkatalog/orte/{kuerzelOrt}/schulen' satisfies keyof paths;
            const kuerzelOrt = 'R76RT9S3';
            const expectedPath = pathTemplate.replace('{kuerzelOrt}', kuerzelOrt);

            const subscription = service.loadSchulen(kuerzelOrt).subscribe();

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
    });
});
