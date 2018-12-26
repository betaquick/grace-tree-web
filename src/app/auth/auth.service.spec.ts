import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { PhoneTypes } from '@betaquick/grace-tree-constants';

import { AuthService } from './auth.service';
import { RegisterUser } from '../shared/models/user-model';

fdescribe('AuthService', () => {
  let httpClient;
  let httpTestingController;
  let authService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [AuthService]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthService);
  });

  it('authService should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('register a new user', () => {
    let user: RegisterUser;
    const response = {body: {token: 'TOKEN', user: {userId: 1}}};

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

    xit('register a new user - set token and user', () => {
      authService.register(user)
        .subscribe(
          (data) => expect(data).toEqual(response)
        );
      const req = httpTestingController.expectOne('/auth/login');
      req.flush(response);
      // Finally, assert that there are no outstanding requests.
      httpTestingController.verify();
    });
  });
});
