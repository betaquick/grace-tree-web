import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let authServiceSpy;
  let authGuard;
  let routerSpy;
  const url = '/url';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {provide: AuthService, useValue: jasmine.createSpyObj('authService', ['register', 'login'])},
        {provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate'])}
      ]
    });
    authGuard = TestBed.get(AuthGuard);
    authServiceSpy = TestBed.get(AuthService);
    routerSpy = TestBed.get(Router);
  });

  it('should create auth.guard', () => {
    expect(authGuard).toBeTruthy();
  });

  it('checkLogin should return true if user is logged in', () => {
    authServiceSpy.isLoggedIn = true;
    expect(authGuard.checkLogin(url)).toEqual(true);
    expect(routerSpy.navigate.calls.count()).toEqual(0);
  });

  it('checkLogin should return true if user is logged in - page is redirected', () => {
    authServiceSpy.isLoggedIn = false;
    expect(authGuard.checkLogin(url)).toEqual(false);
    expect(routerSpy.navigate.calls.count()).toEqual(1);
  });

  it('canActivate should return true if user is logged in', () => {
    authServiceSpy.isLoggedIn = true;
    expect(authGuard.canActivate(null, {url})).toEqual(true);
    expect(routerSpy.navigate.calls.count()).toEqual(0);
  });

  it('canActivateChild should return true if user is logged in', () => {
    authServiceSpy.isLoggedIn = true;
    expect(authGuard.canActivate(null, {url})).toEqual(true);
    expect(routerSpy.navigate.calls.count()).toEqual(0);
  });
});
