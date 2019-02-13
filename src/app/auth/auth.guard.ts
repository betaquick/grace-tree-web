import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserTypes } from '@betaquick/grace-tree-constants';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    const canActivate = this.checkLogin(url) && this.checkUserState();

    return canActivate;
  }

  checkLogin(url: string) {
    if (this.authService.isLoggedIn) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    this.router.navigate(['/login']);
    return false;
  }

  checkUserState(): boolean {
    if (this.authService.isLoggedIn) {
      const user = this.authService.user;
      const company = this.authService.company;
      let isVerified = true;

      let path;

      if (user.userType === UserTypes.Crew) {
        return true;
      }
      
      if (user.userType === UserTypes.General) {
        path = '/user-registration';

        if (user.addresses.length === 0) {
          this.router.navigate([`${path}/add-delivery`]);
          return false;
        }

        if (!user.agreement) {
          this.router.navigate([`${path}/agreement`]);
          return false;
        }
      }
      
      if (user.userType === UserTypes.TreeAdmin) {
        path = '/company-registration';

        if (!company) {
          this.router.navigate([`${path}/add-business`]);
          return false;
        }
      }

      user.phones.forEach(phone => {
        if (phone.primary && !phone.isVerified) {
          isVerified = false;
          this.router.navigate([`${path}/verification`]);
          return;
        }
      });
  
      user.emails.forEach(email => {
        if (email.primary && !email.isVerified) {
          isVerified = false;
          this.router.navigate([`${path}/verification`]);
          return;
        }
      });

      if (!isVerified){
        return false;
      }

      return true;
    }

    return false;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
