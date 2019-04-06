import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { VerificationTypes } from '@betaquick/grace-tree-constants';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../../auth.service';
import { Email, Phone } from '../../../shared/models/user-model';

@Component({
  selector: 'app-company-verification',
  templateUrl: './company-verification.component.html',
  styleUrls: [
    './company-verification.component.scss'
  ]
})

export class CompanyVerificationComponent implements OnInit {
  loading: boolean;
  email: Email;
  phone: Phone;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = false;

    const {user} = this.authService;

    if (user) {
      this.email = _.find(user.emails, e => e.primary);
      this.phone = _.find(user.phones, p => p.primary);
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      const verifyType = params['verifyType'];
      const token = params['token'];
      if (verifyType && token) {
        this.validateToken(verifyType, token);
      }
    });
  }

  validateToken(verifyType, token) {
    this.loading = true;

    this.authService.validateToken(verifyType, token)
    .pipe(finalize(() => this.loading = false))
      .subscribe(
        response => {
          const { user } = response;
          this.email = user.email;
          this.phone = user.phone;
          if (verifyType === VerificationTypes.Email) {
            this.toastr.success('Your email address was successfully verified.');
          } else if (verifyType === VerificationTypes.SMS) {
            this.toastr.success('Your phone number was successfully verified.');
          }
        },
        err => this.toastr.error(err)
      );
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
