import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { UserTypes } from '@betaquick/grace-tree-constants';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../auth.service';
import { AuthDetails, Credentials } from '../../shared/models/user-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})

export class LoginComponent implements OnInit {
  loading: boolean;
  authUser: AuthDetails;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = false;
    this.authUser = new AuthDetails();
    this.authService.logout();
  }

  logIn(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;

    this.authService
      .login(this.authUser)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (credentials: Credentials) => {
          if (this.authService.redirectUrl) {
            return this.router.navigate([this.authService.redirectUrl]);
          }

          const user = _.get(credentials, 'user');

          if (user.userType === UserTypes.TreeAdmin || user.userType === UserTypes.Crew) {
            this.router.navigate(['/company']);
          } else {
            this.router.navigate(['/user']);
          }
        },
        (err) => this.toastr.error(err)
      );
  }
}
