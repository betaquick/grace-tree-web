import { AfterViewInit, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/auth/auth.service';
import { User } from '../../../shared/meta-data/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})

export class LoginComponent implements OnInit {
  user = new User();
  loading: boolean;
  errorMessage: string;


  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }


  ngOnInit() {
    this.loading = false;
  }

  logIn(): void {
    if (this.loading === true) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.user)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          if (this.authService.sync()) {
            this.router.navigate(['/home']);
          }
        },
        () => this.errorMessage = 'Invalid Email or Password'
      );
  }
}
