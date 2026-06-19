import { appRoutes } from './app.routes';

describe('appRoutes', () => {
    it('should configure remote route for minikaenguru-anwendung', () => {
        const route = appRoutes.find(r => r.path === 'minikaenguru-anwendung');

        expect(route).toBeDefined();
        expect(route?.loadComponent).toBeTypeOf('function');
        expect(route?.component).toBeUndefined();
    });

    it('should configure remote route for raetselbaukasten', () => {
        const route = appRoutes.find(r => r.path === 'raetselbaukasten');

        expect(route).toBeDefined();
        expect(route?.loadChildren).toBeTypeOf('function');
        expect(route?.loadComponent).toBeUndefined();
        expect(route?.component).toBeUndefined();
        expect(route?.children).toBeUndefined();
    });
});
