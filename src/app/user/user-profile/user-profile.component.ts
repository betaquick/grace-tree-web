import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { User, Email, Phone } from '../../shared/models/user-model';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';
import { PhoneTypes } from '@betaquick/grace-tree-constants';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class UserProfileComponent implements OnInit {

  isProfileEdit: boolean;
  user: User;
  loading: boolean;
  errorMessage: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.isProfileEdit = false;
    this.loading = false;
    this.user = this.authService.user;

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
  }

  updateprofile() {
    const { firstName, lastName, password, confirmPassword } = this.user;
    if (password && password !== confirmPassword) {
      this.errorMessage = 'Password and confirm password don\'t match';
      return;
    }
    const emails = _.filter(this.user.emails, email => !_.isEmpty(email.emailAddress));
    const phones = _.filter(this.user.phones, phone => !_.isEmpty(phone.phoneNumber));

    const user = {
      firstName,
      lastName,
      emails,
      phones,
      password,
      confirmPassword
    };

    this.loading = true;

    this.userService.updateProfile(user)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.toastr.success('Profile updated successfully');
          this.isProfileEdit = false;
        },
        err => this.toastr.error(err)
      );
  }
}
