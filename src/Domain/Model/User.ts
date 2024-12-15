export enum UserTypes {
  guest = 0,
  member = 1,
}

export interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  userType: UserTypes;
  guestUserInfo: IGuestCoder;
}

export interface IGuestCoder {
  name: string;
  description: string;
  link: string;
}
