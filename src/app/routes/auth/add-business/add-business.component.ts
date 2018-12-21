import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserTypes, RoleTypes, states } from '@betaquick/grace-tree-constants';

import { AuthService, BusinessInfo } from '../../../shared/auth/auth.service';
import { User } from '../../../shared/meta-data/user';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit {
  business: BusinessInfo = {
    state: states[0].abbr,
    userRole: RoleTypes.Admin
  };
  loading: boolean;
  errorMessage: string;
  stateArray = states;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = false;
  }

  addBusinessInfo(): void {
    if (this.loading === true) {
      return;
    }
    this.errorMessage = null;
    this.loading = true;

    this.authService.addBusinessInfo(this.business)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          if (this.authService.sync()) {
            this.router.navigate(['/home']);
          }
        },
        err => this.errorMessage = err.error.message
      );
  }
}
