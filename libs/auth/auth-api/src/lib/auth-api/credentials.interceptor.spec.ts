import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AUTH_CONFIGURATION } from '@matheportal/auth-model';
import { credentialsInterceptor } from './credentials.interceptor';

describe('credentialsInterceptor', () => {
    let http: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: AUTH_CONFIGURATION,
                    useValue: {
                        apiUrl: 'http://localhost:9100',
                    },
                },
                provideHttpClient(withInterceptors([credentialsInterceptor])),
                provideHttpClientTesting(),
            ],
        });

        http = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('sets withCredentials for requests to the configured apiUrl', () => {
        http.get('http://localhost:9100/api/session').subscribe();

        const req = httpTestingController.expectOne('http://localhost:9100/api/session');

        expect(req.request.withCredentials).toBe(true);

        req.flush({});
    });

    it('does not set withCredentials for requests to other URLs', () => {
        http.get('http://localhost:4200/assets/runtime-config.json').subscribe();

        const req = httpTestingController.expectOne('http://localhost:4200/assets/runtime-config.json');

        expect(req.request.withCredentials).toBe(false);

        req.flush({});
    });
});
