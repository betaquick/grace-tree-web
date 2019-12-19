import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { finalize, switchMap, catchError  } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { _throw } from 'rxjs/observable/throw';

import { Email, Phone, User, UserProduct, Address } from '../../shared/models/user-model';
import { CompanyService } from './../company.service';
import { UserService } from '../../user/user.service';
import { AuthService } from '../../auth/auth.service';
import { PhoneTypes } from '@betaquick/grace-tree-constants';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { utils } from '../../shared/utils';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [
      `
        .pcoded-content {
            margin-left: 235px;
        }

        .alert {
            margin-bottom: 10px;
        }
      `
  ],
  styleUrls: [
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CompanyUserProfileComponent implements OnInit, OnDestroy {

  isProfileEdit: boolean;
  userProducts: UserProduct[] = [];
  loading: boolean;
  errorMessage: string;
  primaryAddress: Address;

  user: User;
  // TODO (oneeyedsunday) fetchingUser indicator

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        if (isNaN(+params.get('userId'))) {
          return _throw('Invalid userId');
        }
        return this.companyService.fetchUserData(+params.get('userId'));
      }),
      catchError(() => {
        this.router.navigate(['/company']);
        return Observable.of([]);
      })
    ).subscribe(({ user, company }) => {
      this.user = user;
      this.userProducts = user.products;
      this.primaryAddress = _.head(_.get(this.user, 'addresses'));
      if (this.user.phones.length < 3) {
        this.user.phones.push({ ...(new Phone()), phoneType: PhoneTypes.MOBILE });
      }

      if (this.user.phones.length < 3) {
        this.user.phones.push({ ...(new Phone()), phoneType: PhoneTypes.WORK });
      }

      if (this.user.emails.length < 2) {
        this.user.emails.push(new Email());
      }
    });

  }

  ngOnDestroy() {}

  isBoolean(status) {
    return utils.getBoolean(status) ? 'Yes' : 'No';
  }

  deactivateUser() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.userService.deactivateAccount(this.auth.user.userId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.router.navigate(['/company/user-list']);
        },
        err => this.toastr.error(err)
      );
  }
}
