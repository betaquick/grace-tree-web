import { Product } from './product-model';
import { UserTypes } from '@betaquick/grace-tree-constants';

export class Profile {
  status?: String;
  agreement ? = false;
  createdAt?: String;
}
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
  userAddressId?: number;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  deliveryInstruction?: string;
  latitude?: string;
  longitude?: string;

  constructor() {
    this.street = '';
  }
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
  profile?: Profile;
  userType?: UserTypes;
}

export class AuthDetails {
  email: string;
  password: string;
}

export class ResetPasswordDetails {
  token: string;
  password: string;
  confirmPassword: string;
}

export class Credentials extends User {
  token: string;
}

export class RegisterUser {
  firstName: string;
  lastName: string;
  emails?: Email[];
  email?: string;
  phoneNumber?: string;
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

export class ScheduleDelivery {
  assignedToUserId?: number;
  users?: Array<number>;
  details?: string;
  additionalRecipientText?: string;
  additionalCompanyText?: string;
  statusCode?: string;
  userDeliveryStatus?: string;
  isAssigned?: boolean;
  templateId?: number;
}
