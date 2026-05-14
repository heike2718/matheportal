import { User } from '@matheportal/auth-model';

export interface AuthState {
    readonly user: User;
}
