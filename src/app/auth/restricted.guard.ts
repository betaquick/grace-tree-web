import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

const WHITELIST = [
    'gracetrees@gmail.com'
];

@Injectable()
export class RestrictedGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }


  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const { user } = this.authService;

    if (WHITELIST.indexOf(user.email) < 0) {
      this.router.navigate(['/company']);

      return false;
    }

    return true;
  }
}
