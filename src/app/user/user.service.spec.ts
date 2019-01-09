import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PhoneTypes } from '@betaquick/grace-tree-constants';

import { UserService } from './user.service';
import { RegisterUser } from '../shared/models/user-model';
import { AppConfig } from '../app.config';

describe('UserService', () => {
  let httpMock;
  let userService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    httpMock = TestBed.get(HttpTestingController);
    userService = TestBed.get(UserService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('userService should be created', () => {
    expect(userService).toBeTruthy();
  });

  describe('update user profile', () => {
    let user: RegisterUser;
    const response = {
      user: {
        userId: 1
      }
    };

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

    it('update user profile - returns user', () => {
      userService.updateProfile(user)
        .subscribe(
          data => {
            expect(data).toEqual(response);
          }
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user`);
      expect(req.request.method).toBe('PUT');
      req.flush({ body: response });
      httpMock.verify();
    });

    it('Error: update user profile - server returns error', () => {
      userService.updateProfile(user)
        .subscribe(
          data => fail('Request failed'),
          err => expect(err).toEqual('Something went wrong. Please contact support!')
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user`);
      req.flush('System Error', { status: 500, statusText: 'System Error' });
      httpMock.verify();
    });
  });
});
