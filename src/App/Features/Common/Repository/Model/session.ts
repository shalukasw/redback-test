import { IUser } from 'Domain/Model/User';

export interface Session {
  username: string;
  coder: IUser;
}
