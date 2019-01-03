import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { VerificationTypes } from '@betaquick/grace-tree-constants';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../auth.service';
import { Email, Phone, User } from '../../shared/models/user-model';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: [
    './verification.component.scss'
  ]
})

export class VerificationComponent implements OnInit {
  loading: boolean;
  email: Email;
  phone: Phone;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = false;
    this.email = _.get(this.authService, 'user.emails[0]');
    this.phone = _.get(this.authService, 'user.phones[0]');
  }

  verifyPhone() {
    this.loading = true;

    this.authService.verify(this.phone, VerificationTypes.SMS)
    .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.toastr.success('Phone number verification link sent'),
        err => this.toastr.error(err)
      );
  }

  verifyEmail() {
    this.loading = true;

    this.authService.verify(this.email, VerificationTypes.Email)
    .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.toastr.success('Email verification link sent'),
        err => this.toastr.error(err)
      );
  }
}
