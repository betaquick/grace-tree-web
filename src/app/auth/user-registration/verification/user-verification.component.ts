import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { VerificationTypes } from '@betaquick/grace-tree-constants';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { Email, Phone, User } from '../../../shared/models/user-model';

@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: [
    './user-verification.component.scss'
  ]
})

export class UserVerificationComponent implements OnInit {
  loading: boolean;
  email: Email;
  phone: Phone;
  user: User;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = false;
    this.user = this.authService.user;

    if (this.user) {
      this.email = _.find(this.user.emails, e => e.primary);
      this.phone = _.find(this.user.phones, p => p.primary);
    }

    if (!this.email) {
      this.email = new Email();
    }

    if (!this.phone) {
      this.phone = new Phone();
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
          this.email = user.email || new Email();
          this.phone = user.phone || new Phone();

          if (verifyType === VerificationTypes.Email) {
            this.toastr.success('Your email address was successfully verified.');
          } else if (verifyType === VerificationTypes.SMS) {
            this.toastr.success('Your phone number was successfully verified.');
          }
        },
        err => {
          if (_.isEmpty(this.user)) {
            this.toastr.error(err);
            this.router.navigate(['/']);
          }
        }
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
