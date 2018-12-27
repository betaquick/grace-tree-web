import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PhoneTypes, RoleTypes } from '@betaquick/grace-tree-constants';

import { AuthService } from './auth.service';
import { AuthDetails, RegisterUser } from '../shared/models/user-model';
import { AppConfig } from '../app.config';
import { BusinessInfo } from '../shared/models/company-model';

describe('AuthService', () => {
  let httpMock;
  let authService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [AuthService]
    });
    httpMock = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('authService should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('register a new user', () => {
    let user: RegisterUser;
    const response = {token: 'TOKEN', user: {userId: 1}};

    beforeEach(() => {
      user = new RegisterUser();
      user.firstName = 'Test';
      user.lastName = 'User';
      user.password = '1q2w3e4r5t';
      user.confirmPassword = '1q2w3e4r5t';
      user.emails = [{
        emailAddress: 'test@email.com',
        primary: true
      }];
      user.phones = [{
        phoneNumber: '1234567890',
        primary: true,
        phoneType: PhoneTypes.MOBILE
      }];
    });

    it('register a new user - returns token and user', () => {
      authService.register(user)
        .subscribe(
          data => {
            expect(data).toEqual(response);
          }
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush({body: response});
      httpMock.verify();
    });

    it('Error: register a new user - server returns error', () => {
      authService.register(user)
        .subscribe(
          data => fail('Request failed'),
          err => expect(err).toEqual('Something went wrong. Please contact support!')
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/auth/register`);
      req.flush('System Error', { status: 500, statusText: 'System Error' });
      httpMock.verify();
    });
  });

  describe('Add a new business', () => {
    let businessInfo: BusinessInfo;
    const response = {company: {companyId: 1, companyName: 'Test Company'}};

    beforeEach(() => {
      businessInfo = new BusinessInfo();
      businessInfo.companyName = 'Test Company',
      businessInfo.companyAddress = 'Test Address',
      businessInfo.city = 'City',
      businessInfo.state = 'AL',
      businessInfo.userRole = RoleTypes.Admin,
      businessInfo.zip = '23401',
      businessInfo.website = 'example.com'
    });

    it('add a new business - returns company', () => {
      authService.addBusinessInfo(businessInfo)
        .subscribe(
          data => {
            expect(data.body).toEqual(response);
          }
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/business`);
      expect(req.request.method).toBe('POST');
      req.flush({body: response});
      httpMock.verify();
    });

    it('Error: add a new business - server returns error', () => {
      authService.addBusinessInfo(businessInfo)
        .subscribe(
          data => fail('Request failed'),
          err => expect(err).toEqual('Something went wrong. Please contact support!')
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/business`);
      req.flush('System Error', { status: 500, statusText: 'System Error' });
      httpMock.verify();
    });
  });

  describe('login a new user', () => {
    let authUser: AuthDetails;
    const response = {token: 'TOKEN', user: {userId: 1}};

    beforeEach(() => {
      authUser = new AuthDetails;
      authUser.email = 'test@email.com';
      authUser.password = '1q2w3e4r5t';
    });

    it('logins in user - returns token and user', () => {
      authService.login(authUser)
        .subscribe(
          data => {
            expect(data).toEqual(response);
          }
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush({body: response});
      httpMock.verify();
    });

    it('Error: logins in user - server returns error', () => {
      authService.login(authUser)
        .subscribe(
          data => fail('Server error'),
          err => expect(err).toEqual('Something went wrong. Please contact support!')
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/auth/login`);
      req.flush('System Error', { status: 500, statusText: 'System Error' });
      httpMock.verify();
    });
  });
});
