import { fromAuth } from '@matheportal/auth-data';

export { authDataProvider } from './lib/auth-api/auth-data.provider';
export { AuthFlowFacade } from './lib/auth-api/auth-flow.facade';
export { PortalSessionFacade } from './lib/auth-api/portal-session.facade';
export { credentialsInterceptor } from './lib/auth-api/credentials.interceptor';

export { userLoggedOut, sessionValidationFailed, userAugmented } from './lib/auth-api/auth-store.events';

export const sessionState = fromAuth.sessionLoadState;
