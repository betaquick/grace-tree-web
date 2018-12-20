export interface IUser {
  userId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  userType?: String;
}


export class User implements IUser {
  public userId?: number;
  public firstName?: string;
  public lastName?: string;
  public email: string;
  public password: string;
  public confirmPassword?: string;
  public userType?: string;

  constructor() {
  }
}
