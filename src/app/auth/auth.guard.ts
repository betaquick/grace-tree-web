import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { UserTypes } from '@betaquick/grace-tree-constants';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    
    const canActivate = this.checkLogin(url);

    return canActivate;
  }

  checkLogin(url: string) {
    if (this.authService.isLoggedIn) {
      // go through user state
      return this.checkUserState();
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    
    this.router.navigate(['/login']);
    return false;
  }
  
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

  private checkUserState(): boolean {
    const {user, company} = this.authService;

    if (user.userType === UserTypes.General) {
      if (_.isEmpty(user.addresses)) {
        this.router.navigate(['user-registration/add-delivery']);
        return false;
      }
      if (!user.profile.agreement) {
        this.router.navigate(['user-registration/agreement']);
        return false;
      }
      if(_.find(user.phones, phone => phone.primary && !phone.isVerified)) {
        this.router.navigate(['user-registration/verification']);
        return false;
      }
      if(_.find(user.emails, email => email.primary && !email.isVerified)) {
        this.router.navigate(['user-registration/verification']);
        return false;
      }
    }

    if (user.userType === UserTypes.TreeAdmin) {
      if (!company) {
        this.router.navigate(['company-registration/add-business']);
        return false;
      }
      if(_.find(user.phones, phone => phone.primary && !phone.isVerified)) {
        this.router.navigate(['company-registration/verification']);
        return false;
      }
      if(_.find(user.emails, email => email.primary && !email.isVerified)) {
        this.router.navigate(['company-registration/verification']);
        return false;
      }
    }
    
    return true;
  }
}
