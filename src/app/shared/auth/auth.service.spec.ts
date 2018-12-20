import { AuthService, Credentials, TOKEN_NAME } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { asyncData, asyncError } from '../../testing/helpers';
import { IUser } from '../meta-data/user';


describe('AuthService', () => {
  const validToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW`
    + `QiOjIsImVtYWlsIjoiZW1wbG95ZWUxQGJldGFxdWljay5jb20iLCJuYW1l`
    + `IjoiRW1wbG95ZWUgT25lIiwiY3JlYXRlZF9hdCI6IjIwMTgtMTAtMjZUMTM6Mjk6NDAuMDAwWiIs`
    + `ImlhdCI6MTU0MDg5NTY5NSwiZXhwIjoxOTQwOTgyMDk1fQ.9IQ9id2RxKjav_xzYBRcelfk-ThvZJJiuQZwYHaSrVo`;
  const invalidToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`;
  const incompleteToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e`
    + `yJ1c2VySWQiOjIsImVtYWlsIjoiZW1wbG95ZWUxQGJldGFxdWljay5jb20iLCJuYW1lIjoiRW`
    + `1wbG95ZWUgT25lIiwiY3JlYXRlZF9hdCI6IjIwMTgtMTAtMjZUMTM6Mjk6NDAuMD`
    + `AwWiIsImlhdCI6MTU0MDg5NTY5NX0.Mm7-vyI36cOtoGYHQ-JB4E8kVD10vA7CxR2Uyv0aSeg`;
  const expiredToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
    + `.eyJ1c2VySWQiOjIsImVtYWlsIjoiZW1wbG95ZWUxQGJldGFxdWljay5jb2`
    + `0iLCJuYW1lIjoiRW1wbG95ZWUgT25lIiwiY3JlYXRlZF9hdCI6IjIwMTgtMT`
    + `AtMjZUMTM6Mjk6NDAuMDAwWiIsImlhdCI6MTU0MDg5NTY5NSwiZXhwIjoxMDQwOTgyMDk1fQ.V3a7-netKffQwgA0inOI6lvNGkr-VuIeT_0to5p2WKs`;

  let httpClientSpy: { post: jasmine.Spy, get: jasmine.Spy };
  let authService: AuthService;
  const expectedCredentials: Credentials | null = {
    token: validToken,
    user: {
      userId: 1,
      email: 'employee1@betaquick.com',
      firstName: 'Employee',
      lastName: 'One'
    }
  };
  const expectedUser: IUser = {
    email: 'user@firm.net'
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    authService = new AuthService(<any> httpClientSpy);
  });

  describe('#Login', () => {

    it('should return expected credentials', () => {

      httpClientSpy.post.and.returnValue(asyncData({body: expectedCredentials}));

      authService.login({email: 'hi@email.com', password: ''})
        .subscribe(
          credentials => {
            expect(credentials).toEqual(expectedCredentials, 'expected credentials');
            authService.isLoggedIn.subscribe(isLoggedIn => expect(isLoggedIn).toEqual(true));
          },
          fail
        );
      expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });

    it('should return an error when the server returns a 404', () => {
      const errorResponse = new HttpErrorResponse({
        error: true,
        status: 404,
        statusText: 'Not Found'
      });

      httpClientSpy.post.and.returnValue(asyncError(errorResponse));

      authService.login({email: 'hi@email.com', password: ''})
        .subscribe(
          credentials => fail('expected an error, not credentials'),
          error => expect(error.status).toEqual(404)
        );
    });

    it('should return an error when login fails', () => {
      const errorResponse = new HttpErrorResponse({
        error: {message: 'Invalid Email or Password'},
        status: 401,
        statusText: 'Not Found'
      });

      httpClientSpy.post.and.returnValue(asyncError(errorResponse));

      authService.login({email: 'hi@email.com', password: ''})
        .subscribe(
          credentials => fail('expected an error, not credentials'),
          error => expect(error.status).toEqual(401)
        );
    });


    it('#user should return value from observable',
      (done: DoneFn) => {
        authService.user.subscribe(value => {
            expect(value).toEqual({});
            done();
          },
          fail);
      });
  });

  describe('#logout', () => {

    it('should return true if logged out', () => {

      authService.logout().subscribe(
        status => expect(status).toEqual(true),
        fail
      );
    });
  });

  describe('#sync', () => {
    afterEach(() => {
      localStorage.clear();
    });

    it('should return false if token is invalid', () => {
      localStorage.setItem('jwt_token', invalidToken);

      expect(authService.sync()).toEqual(false);
    });

    it('should return false if token has no expiry', () => {
      localStorage.setItem('jwt_token', incompleteToken);

      expect(authService.sync()).toEqual(false);
    });

    it('should return false if token has expired', () => {
      localStorage.setItem('jwt_token', expiredToken);

      expect(authService.sync()).toEqual(false);
    });

    it('should return true if token is valid', () => {
      localStorage.setItem('jwt_token', validToken);

      expect(authService.sync()).toEqual(true);
    });

    it('should return false if no token', () => {
      expect(authService.sync()).toEqual(false);
    });


  });

  describe('#requestResetPasswordToken', () => {

    it('should return expected credentials', () => {

      httpClientSpy.post.and.returnValue(asyncData({message: 'email sent...'}));

      authService.requestResetPasswordToken('hi@email.com')
        .subscribe(
          message => {
            expect(message).toEqual('email sent...', 'expected message');
          },
          fail
        );
      expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });

  });

  describe('#confirmResetPasswordToken', () => {

    it('should return expected credentials', () => {

      httpClientSpy.get.and.returnValue(asyncData({body: {user: expectedUser}}));

      authService.confirmResetPasswordToken('fakeToken')
        .subscribe(
          user => {
            expect(user).toEqual(expectedUser, 'expected user');
          },
          fail
        );
      expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    });

  });

  describe('#resetPassword', () => {

    it('should return expected credentials', () => {

      httpClientSpy.post.and.returnValue(asyncData({message: 'email sent...'}));

      authService.resetPassword({
        token: 'fakeToken',
        password: 'fakePassword',
        confirmPassword: 'fakePassword',
      })
        .subscribe(
          message => {
            expect(message).toEqual('email sent...', 'expected message');
          },
          fail
        );
      expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    });
  });

});
