import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserTypes, PhoneTypes } from '@betaquick/grace-tree-constants';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { RegisterUser, Email, Phone } from '../../../shared/models/user-model';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  user: RegisterUser;
  loading: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loading = false;
    this.user = new RegisterUser();
    this.user.emails = [new Email(), { ...(new Email()), primary: false }];
    this.user.phones = [{...new Phone(), phoneType: PhoneTypes.HOME },
      { ...(new Phone()), primary: false, phoneType: PhoneTypes.MOBILE },
      { ...(new Phone()), primary: false, phoneType: PhoneTypes.WORK }];
  }

  register() {
    if (this.loading === true) {
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      return;
    }
    this.user.emails[0].primary = true;
    this.user.phones[0].primary = true;
    this.user.userType = UserTypes.General;

    this.loading = true;

    this.authService.register(this.user)
    .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.router.navigate(['/user-registration/add-delivery']),
        err => this.toastr.error(err)
      );
  }

}
