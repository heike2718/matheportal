import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
    let service: LoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoadingService],
        });
        service = TestBed.inject(LoadingService);
    });

    it('should not be loading initially', () => {
        expect(service.loading()).toBeFalsy();
    });

    it('should start and stop', () => {
        service.start();
        expect(service.loading()).toBeTruthy();

        service.stop();
        expect(service.loading()).toBeFalsy();
    });
});
