import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, flatMap } from 'rxjs/operators';

import { UserTypes } from '@betaquick/grace-tree-constants';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: [
    './agreement.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class AgreementComponent implements OnInit {
  loading: boolean;
  acceptAcceptment: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loading = false;
    this.acceptAcceptment = false;
  }

  acceptAgreement() {
    if (this.loading || !this.acceptAcceptment) {
      return;
    }
    this.loading = true;

    this.authService.acceptAgreement()
      .pipe(
        flatMap(() => this.authService.fetchUser()),
        finalize(() => this.loading = false)
      )
      .subscribe(
        user => {
          if (user.userType === UserTypes.TreeAdmin || user.userType === UserTypes.Crew) {
            this.router.navigate(['/company']);
          } else {
            this.router.navigate(['/user']);
          }
        },
        err => this.toastr.error(err)
      );
  }
}
