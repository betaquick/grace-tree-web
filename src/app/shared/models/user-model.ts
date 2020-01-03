import { Product } from './product-model';
import { UserTypes } from '@betaquick/grace-tree-constants';
import { utils } from '../utils';

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
  constructor() {
    this.phoneNumber = '';
    this.primary = true;
  }
}

export class Email {
  emailAddress: string;
  primary: boolean;
  isVerified?: boolean;
  constructor() {
    this.emailAddress = '';
    this.primary = true;
  }
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
    this.deliveryInstruction = '';
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

  static trimValues(user: RegisterUser): RegisterUser {
    // copy values over
    user = JSON.parse(JSON.stringify(user));
    if (user.firstName) {
      user.firstName = utils.trimValue(user.firstName);
    }
    if (user.lastName) {
      user.lastName = utils.trimValue(user.lastName);
    }
    if (user.phoneNumber) {
      user.phoneNumber = utils.trimValue(user.phoneNumber);
    }
    if (user.email) {
      user.email = utils.trimValue(user.email);
    }
    (user.emails || []).forEach(emailObj => {
      if (emailObj && emailObj.emailAddress) {
        emailObj.emailAddress = utils.trimValue(emailObj.emailAddress);
      }
    });
    return user;
  }
}

export class UserPreferences {
  getEstimateInfo: boolean;
  service_needs: string;
  self_pickup: boolean;
}

export class UserProduct extends Product {
  userProductId?: number;
  userId?: number;
  status: boolean;
}

export class DeliveryInfo {
  userProducts: Array<UserProduct>;
  address: Address;
  preferences?: UserPreferences;
}

export class ScheduleDelivery {
  assignedToUserId?: number;
  users?: Array<number>;
  userId?: number;
  details?: string;
  additionalRecipientText?: string;
  additionalCompanyText?: string;
  statusCode?: string;
  userDeliveryStatus?: string;
  isAssigned?: boolean;
  products?: UserProduct[];
}
