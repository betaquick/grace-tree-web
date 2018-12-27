import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserTypes, PhoneTypes } from '@betaquick/grace-tree-constants';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../auth.service';
import { RegisterUser, Email, Phone } from '../../../shared/models/user-model';

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.scss']
})
export class CompanyRegistrationComponent implements OnInit {
  user: RegisterUser;
  loading: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.loading = false;
    this.user = new RegisterUser();
    this.user.emails = [new Email()];
    this.user.phones = [new Phone()];
  }

  register() {
    if (this.loading === true) {
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      return;
    }

    this.loading = true;

    this.user.emails[0].primary = true;
    this.user.phones[0].primary = true;
    this.user.phones[0].phoneType = PhoneTypes.MOBILE;
    this.user.userType = UserTypes.TreeAdmin;

    this.authService.register(this.user)
    .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.router.navigate(['/company-registration/add-business']),
        err => this.toastr.error(err)
      );
  }
}
