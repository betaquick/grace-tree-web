import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Email, Phone, RegisterUser, UserProduct, Address } from '../../shared/models/user-model';
import { UserService } from '../user.service';
import { PhoneTypes } from '@betaquick/grace-tree-constants';
import { utils } from '../../shared/utils';
import { SessionStorage } from 'ngx-store';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class UserProfileComponent implements OnInit, OnDestroy {

  isProfileEdit: boolean;
  isPreferenceEdit: boolean;
  userProducts: UserProduct[];
  loading: boolean;
  errorMessage: string;
  primaryAddress: Address;

  @SessionStorage() user: RegisterUser = new RegisterUser();

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.isProfileEdit = false;
    this.isPreferenceEdit = false;
    this.loading = false;

    this.userProducts = [new UserProduct()];
    this.primaryAddress = _.head(_.get(this.user, 'addresses'));

    if (this.user.phones.length < 3) {
      this.user.phones.push({ ...(new Phone()), phoneType: PhoneTypes.MOBILE });
    }

    if (this.user.phones.length < 3) {
      this.user.phones.push({ ...(new Phone()), phoneType: PhoneTypes.WORK });
    }

    if (this.user.emails.length < 2) {
      this.user.emails.push(new Email());
    }

    this.getUserProducts();
  }

  ngOnDestroy() {}

  getUserProducts() {
    this.userService
      .getUserProducts()
      .subscribe(userProducts => this.userProducts = userProducts,
      err => this.toastr.error(err)
    );
  }

  toggleUpdateProfile() {
    this.isProfileEdit = !this.isProfileEdit;

    if (this.isProfileEdit) {
      if (this.user.emails.length === 1) {
        const email = new Email();
        email.primary = false;

        this.user.emails.push(email);
      }

      if (this.user.phones.length === 1) {
        const phone = new Phone();
        phone.primary = false;
        phone.phoneType = PhoneTypes.HOME;

        this.user.phones.push(phone);
      }
    } else {
      const emails = _.filter(this.user.emails, email => !_.isEmpty(email.emailAddress));
      const phones = _.filter(this.user.phones, phone => !_.isEmpty(phone.phoneNumber));

      this.user.emails = emails;
      this.user.phones = phones;
    }
  }

  isBoolean(status) {
    return utils.getBoolean(status) ? 'Yes' : 'No';
  }

  updateprofile() {
    const { firstName, lastName, password, confirmPassword } = this.user;
    if (password && password !== confirmPassword) {
      this.errorMessage = 'Password and confirm password don\'t match';
      return;
    }

    this.loading = true;

    const emails: Array<Email> = [];
    const phones: Array<Phone> = [];

    this.user.emails.forEach(email => {
      if (_.isEmpty(email.emailAddress)) {
        return;
      }

      emails.push(
        _.pick(email, ['emailAddress', 'primary'])
      );
    });

    this.user.phones.forEach(phone => {
      if (_.isEmpty(phone.phoneNumber)) {
        return;
      }

      phones.push(
        _.pick(phone, ['phoneNumber', 'primary', 'phoneType'])
      );
    });

    const user = {
      firstName,
      lastName,
      emails,
      phones,
      password,
      confirmPassword
    };

    this.userService.updateProfile(user)
      .pipe(finalize(() => {
        this.loading = false;
        this.isProfileEdit = false;
      }))
      .subscribe(
        data => this.toastr.success('Profile updated successfully'),
        err => this.toastr.error(err)
      );
  }

  updateDeliveryPreference() {
    if (this.loading === true) {
      return;
    }

    const userProducts = _.map(this.userProducts, userProduct => {
      const  { productId, status } = userProduct;

      return {
        productId,
        status: utils.getBoolean(status)
      };
    });

    this.loading = true;

    this.userService.updateUserProducts(userProducts)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.toastr.success('Delivery preference updated successfully');
          this.isPreferenceEdit = false;
        },
        err => this.toastr.error(err)
      );
  }
}
