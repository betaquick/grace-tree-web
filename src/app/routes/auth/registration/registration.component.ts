import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserTypes } from '@betaquick/grace-tree-constants';

import { AuthService } from '../../../shared/auth/auth.service';
import { User, IUser, IEmail, IPhone } from '../../../shared/meta-data/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  loading = false;

  user: IUser = new User();
  emails: Array<IEmail> = [
    {
      emailAddress: '',
      primary: true,
    },
    {
      emailAddress: '',
      primary: false,
    },
  ];
  phones: Array<IPhone> = [
    {
      phoneNumber: '',
      primary: true,
      phoneType: 'Mobile'
    },
    {
      phoneNumber: '',
      primary: false,
      phoneType: 'Home'
    },
  ];
  errorMessage: string;
  fieldPlaceholder: object = {}

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = false;
    this.getRoute();
  }

  getRoute() {
    this.route.data.subscribe(data => {
      const { userType } = data;
      this.user.userType = userType;

      this.fieldPlaceholder = {
        firstName: userType === UserTypes.General ? 'First Name' : 'Owner\'s First Name',
        lastName: userType === UserTypes.General ? 'Last Name' : 'Owner\'s Last Name',
        showUserLink: userType === UserTypes.General ? true : false,
      }
    });
  }

  register(): void {
    if (this.loading === true) {
      return;
    }
    this.errorMessage = null;

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Password does not match confirm password';
      return;
    }

    this.loading = true;

    this.user.emails = this.emails.filter(email => email.emailAddress !== '');
    this.user.phones = this.phones.filter(phone => phone.phoneNumber !== '');

    this.authService.register(this.user)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          if (this.authService.sync()) {
            if (this.user.userType === UserTypes.TreeAdmin) {
              this.router.navigate(['/auth/tree-service/business/add']);
            } else {
              this.router.navigate(['/auth/delivery/add']);
            }
          }
        },
        err => this.errorMessage = err.error.message
      );
  }
}
