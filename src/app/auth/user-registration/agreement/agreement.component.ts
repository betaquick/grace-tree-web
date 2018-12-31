import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

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
    if (this.loading) {
      return;
    }
    this.loading = true;

    this.authService.acceptAgreement()
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => this.router.navigate(['/user']),
        err => this.toastr.error(err)
      );
  }
  
}