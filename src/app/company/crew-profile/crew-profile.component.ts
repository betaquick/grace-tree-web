import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Email, Phone, RegisterUser, UserProduct, User } from '../../shared/models/user-model';
import { CompanyService } from '../company.service';
import { PhoneTypes } from '@betaquick/grace-tree-constants';
import { utils } from '../../shared/utils';
import { SessionStorage } from 'ngx-store';

@Component({
  selector: 'app-crew-profile',
  templateUrl: './crew-profile.component.html',
  styleUrls: [
    './crew-profile.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CrewProfileComponent implements OnInit {

  isProfileEdit: boolean;
  loading: boolean;
  errorMessage: string;

  @SessionStorage() user: RegisterUser = new RegisterUser();

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.isProfileEdit = false;
    this.loading = false;
  }

  toggleUpdateProfile() {
    this.isProfileEdit = !this.isProfileEdit;

    if (this.isProfileEdit) {
      if (this.user.emails.length === 0) {
        const email = new Email();
        email.emailAddress = this.user.email;
        email.primary = true;

        this.user.emails.push(email);
      }

      if (this.user.phones.length === 0) {
        const phone = new Phone();
        phone.primary = true;
        phone.phoneType = PhoneTypes.MOBILE;

        this.user.phones.push(phone);
      }
    } else {
      const emails = _.filter(this.user.emails, email => !_.isEmpty(email.emailAddress));
      const phones = _.filter(this.user.phones, phone => !_.isEmpty(phone.phoneNumber));

      this.user.emails = emails;
      this.user.phones = phones;
    }
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

    this.companyService.updateProfile(user)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
          this.toastr.success('Profile updated successfully');
          this.isProfileEdit = false;
          this.user = data.user;
        },
        err => this.toastr.error(err)
      );
  }
}
