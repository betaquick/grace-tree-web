import { Product } from './product-model';

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
  phones?: Array<Phone>;
  emails?: Array<Email>;
  addresses?: Array<Address>;
  userType?: String;
  status?: String;
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
  emails?: Email[];
  email?: string;
  phones?: Phone[];
  password?: string;
  confirmPassword?: string;
  userType?: string;
}

export class UserProduct extends Product {
  userProductId?: number;
  userId?: number;
  status: boolean;
}

export class DeliveryInfo {
  userProducts: Array<UserProduct>;
  address: Address;
}
