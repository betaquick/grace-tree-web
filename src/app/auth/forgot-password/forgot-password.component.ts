import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../auth.service';
import { AuthDetails } from '../../shared/models/user-model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})

export class ForgotPasswordComponent implements OnInit {
  loading: boolean;
  authUser: AuthDetails;

  @ViewChild("forgotPasswordForm")
  forgotPasswordForm: NgForm;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = false;
    this.authUser = new AuthDetails();
  }

  requestPasswordReset(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;

    this.authService
      .requestResetPassword(this.authUser.email)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        response => {
          this.toastr.success(response.message);
          this.authUser.email = '';
          this.forgotPasswordForm.resetForm();
        },
        err => this.toastr.error(err)
      );
  }
}
