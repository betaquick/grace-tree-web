export interface IPhone {
  userPhoneId?: number;
  userId?: number;
  phoneNumber: string;
  primary: boolean;
  phoneType?: string;
  isVerified?: boolean;
}

export interface IEmail {
  userEmailId?: number;
  userId?: number;
  emailAddress: string;
  primary: boolean;
  isVerified?: boolean;
}

export interface IUser {
  userId?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phones?: Array<IPhone>;
  emails?: Array<IEmail>;
  userType?: String;
}


export class User implements IUser {
  public userId?: number;
  public firstName?: string;
  public lastName?: string;
  public email: string;
  public password: string;
  public confirmPassword?: string;
  public phones?: Array<IPhone>;
  public emails?: Array<IEmail>;
  public userType?: string;

  constructor() {
  }
}
