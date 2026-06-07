import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AUTH_CONFIGURATION } from '@matheportal/auth-model';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
    const authConfig = inject(AUTH_CONFIGURATION);

    if (!req.url.startsWith(authConfig.apiUrl)) {
        return next(req);
    }

    return next(req.clone({ withCredentials: true }));
};
