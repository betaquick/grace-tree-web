import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import * as _ from 'lodash';
import { SessionStorage } from 'ngx-store';

import { AppConfig } from '../app.config';
import { AuthDetails, Credentials, User, RegisterUser } from '../shared/models/user-model';
import { utils } from '../shared/utils';

@Injectable()
export class AuthService {

  public isLoggedIn = false;

  @SessionStorage() token = '';
  @SessionStorage() user: User = new User();

  redirectUrl: string; // store the URL so we can redirect after logging in

  constructor(private http: HttpClient) {}

  register(regUser: RegisterUser) {
    return this.http
      .post(`${AppConfig.API_URL}/auth/register`, regUser)
      .pipe(
        map(this.handleSuccessAuth.bind(this)),
        catchError(utils.handleError)
      );
  }

  login(authUser: AuthDetails): Observable<Credentials> {
    return this.http
      .post(`${AppConfig.API_URL}/auth/login`, authUser)
      .pipe(
        map(this.handleSuccessAuth.bind(this)),
        catchError(utils.handleError)
      );
  }

  private handleSuccessAuth(response) {
    const credentials = _.get(response, 'body');
    this.token = _.get(credentials, 'token');
    this.user = _.get(credentials, 'user');
    this.isLoggedIn = true;
    return credentials;
  }

  logout() {
    this.isLoggedIn = false;
    this.user = null;
    this.token = '';
  }

}
