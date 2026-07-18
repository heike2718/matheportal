import { TestBed } from '@angular/core/testing';
import { LOCATION_HASH_SERVICE } from './location-hash.service';

describe('LOCATION_HASH_SERVICE', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
        window.history.replaceState(null, document.title, '/test-page?foo=bar');
    });
    it('should read window.location.hash', () => {
        window.history.replaceState(null, document.title, '/test-page?foo=bar#state=login&idToken=abc');

        const service = TestBed.inject(LOCATION_HASH_SERVICE);

        expect(service.read()).toBe('#state=login&idToken=abc');
    });

    it('should clear window.location.hash and keep path and query params', () => {
        window.history.replaceState(null, document.title, '/test-page?foo=bar#state=login&idToken=abc');

        const service = TestBed.inject(LOCATION_HASH_SERVICE);

        service.clear();

        expect(window.location.pathname).toBe('/test-page');
        expect(window.location.search).toBe('?foo=bar');
        expect(window.location.hash).toBe('');
    });
});
