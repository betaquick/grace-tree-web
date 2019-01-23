import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../auth.service';
import { ResetPasswordDetails } from '../../shared/models/user-model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})

export class ResetPasswordComponent implements OnInit {
  loading: boolean;
  resetDetails: ResetPasswordDetails;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = false;
    this.resetDetails = new ResetPasswordDetails();

    this.route.paramMap.subscribe(
      (params: ParamMap) => this.confirmToken(params.get('token'))
    );
  }

  confirmToken(token) {
    this.resetDetails.token = token;

    this.authService.confirmResetPasswordToken(token)
      .subscribe(
        null,
        err => {
          this.toastr.error(err);
          this.router.navigate(['login']);
        }
      );
  }

  resetPassword(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;

    this.authService
      .resetPassword(this.resetDetails)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        response => {
          this.toastr.success(response.message);
          this.router.navigate(['login']);
        },
        err => this.toastr.error(err)
      );
  }
}
