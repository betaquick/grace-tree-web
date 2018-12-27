export class Phone {
  userPhoneId?: number;
  userId?: number;
  phoneNumber: string;
  primary: boolean;
  phoneType?: string;
  isVerified?: boolean;
}

export class Email {
  emailAddress: string;
  primary: boolean;
  isVerified?: boolean;
}

export class Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export class User {
  userId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  phones?: Array<Phone>;
  emails?: Array<Email>;
  addresses?: Array<Address>;
  userType?: String;
}

export class AuthDetails {
  email: string;
  password: string;
}

export class Credentials extends User {
  token: string;
}

export class RegisterUser {
  firstName: string;
  lastName: string;
  emails: Email[];
  phones: Phone[];
  password: string;
  confirmPassword: string;
  userType: string;
}
