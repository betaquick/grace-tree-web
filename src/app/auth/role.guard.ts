import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserTypes } from '@betaquick/grace-tree-constants';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }


  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles = route.data['roles'] as UserTypes[];
    const { user } = this.authService;

    if (roles.indexOf(user.userType) < 0) {
      this.router.navigate(['/']);

      return false;
    }

    return true;
  }
}
