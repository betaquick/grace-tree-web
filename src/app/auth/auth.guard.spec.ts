import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { UserTypes } from '@betaquick/grace-tree-constants';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from '../shared/models/user-model';

describe('AuthGuard', () => {
  let authServiceSpy;
  let authGuard;
  let routerSpy;
  const url = '/url';

  const user: User = {
    firstName: 'Test',
    lastName: 'Account',
    emails: [{
      emailAddress: 'test@email.com',
      primary: true,
      isVerified: true
    }],
    phones: [{
      phoneNumber: '1234567890',
      primary: true,
      isVerified: true
    }],
    addresses: [{
      street: 'Test street'
    }],
    agreement: true
  };

  const company = {
    companyName: 'Test Company',
    companyAddress: 'Test Address',
    city: 'City',
    state: 'AL',
    zip: '23401',
    website: 'example.com',
    latitude: 37.4219931,
    longitude: -122.0851244
  };

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

  it('checkUserState for crew should return true if state is okay ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.Crew;
    authServiceSpy.user = clonedUser;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(true);
    expect(routerSpy.navigate.calls.count()).toEqual(0);
  });

  it('checkUserState for crew should return false if state is not okay ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.Crew;
    authServiceSpy.user = clonedUser;
    authServiceSpy.isLoggedIn = false;

    expect(authGuard.checkUserState()).toEqual(false);
    expect(routerSpy.navigate.calls.count()).toEqual(0);
  });

  it('checkUserState for general user should return true if state is okay ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.General;
    authServiceSpy.user = clonedUser;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(true);
    expect(routerSpy.navigate.calls.count()).toEqual(0);
  });

  it('checkUserState for general user should return false if addresses empty ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.General;
    clonedUser.addresses = [];
    authServiceSpy.user = clonedUser;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(false);
    expect(routerSpy.navigate.calls.count()).toEqual(1);
  });

  it('checkUserState for general user should return false if agreement is false ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.General;
    clonedUser.agreement = false;
    authServiceSpy.user = clonedUser;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(false);
    expect(routerSpy.navigate.calls.count()).toEqual(1);
  });

  it('checkUserState for general user should return false if primary phone is not verified ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.General;
    clonedUser.phones[0].isVerified = false;
    authServiceSpy.user = clonedUser;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(false);
    expect(routerSpy.navigate.calls.count()).toEqual(1);
  });

  it('checkUserState for general user should return false if primary email is not verified ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.General;
    clonedUser.emails[0].isVerified = false;
    authServiceSpy.user = clonedUser;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(false);
    expect(routerSpy.navigate.calls.count()).toEqual(1);
  });

  it('checkUserState for tree admin should return true if state is okay ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.TreeAdmin;
    authServiceSpy.user = clonedUser;
    authServiceSpy.company = company;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(true);
    expect(routerSpy.navigate.calls.count()).toEqual(0);
  });

  it('checkUserState for tree admin should return false if company is null ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.TreeAdmin;
    authServiceSpy.user = clonedUser;
    authServiceSpy.company = null;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(false);
    expect(routerSpy.navigate.calls.count()).toEqual(1);
  });

  it('checkUserState for tree admin should return false if primary phone is not verified ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.TreeAdmin;
    clonedUser.phones[0].isVerified = false;
    authServiceSpy.user = clonedUser;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(false);
    expect(routerSpy.navigate.calls.count()).toEqual(1);
  });

  it('checkUserState for tree admin should return false if primary email is not verified ', () => {
    const clonedUser = _.cloneDeep(user);
    clonedUser.userType = UserTypes.TreeAdmin;
    clonedUser.emails[0].isVerified = false;
    authServiceSpy.user = clonedUser;
    authServiceSpy.isLoggedIn = true;

    expect(authGuard.checkUserState()).toEqual(false);
    expect(routerSpy.navigate.calls.count()).toEqual(1);
  });

  it('canActivate should return true if user is logged in', () => {
    authServiceSpy.isLoggedIn = true;
    authServiceSpy.user = user;
    authServiceSpy.company = company;
    expect(authGuard.canActivate(null, {url})).toEqual(true);
    expect(routerSpy.navigate.calls.count()).toEqual(0);
  });

  it('canActivateChild should return true if user is logged in', () => {
    authServiceSpy.isLoggedIn = true;
    authServiceSpy.user = user;
    authServiceSpy.company = company;
    expect(authGuard.canActivate(null, {url})).toEqual(true);
    expect(routerSpy.navigate.calls.count()).toEqual(0);
  });
});
