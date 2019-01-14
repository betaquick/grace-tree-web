import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { SessionStorage } from 'ngx-store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { User, UserProduct } from '../shared/models/user-model';
import { AppConfig } from '../app.config';
import { utils } from '../shared/utils';

@Injectable()
export class UserService {

  @SessionStorage() user: User = new User();
  @SessionStorage() userProducts: UserProduct[];

  constructor(
    private http: HttpClient
  ) {}

  updateProfile(profile: User) {
    return this.http
      .put(`${AppConfig.API_URL}/user`, profile)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          this.user = _.get(body, 'user');

          return body;
        }),
        catchError(utils.handleError)
      );
  }

  updateStatus(status: String) {
    return this.http
      .put(`${AppConfig.API_URL}/user/status/${status}`, null)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          const user = this.user;
          user.status = _.get(body, 'user.status');
          this.user = user;

          return body;
        }),
        catchError(utils.handleError)
      );
  }

  getUserProducts(): Observable<UserProduct[]> {
    if (this.userProducts) {
      return of(this.userProducts);
    }

    return this.http.get(`${AppConfig.API_URL}/user/products`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          this.userProducts = _.get(body, 'userProducts');

          return this.userProducts;
        }),
        catchError(utils.handleError)
      );
  }

  updateUserProducts(userProducts: UserProduct[]) {
    return this.http
      .put(`${AppConfig.API_URL}/user/products`, userProducts)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          this.userProducts = _.get(body, 'userProducts');

          return this.userProducts;
        }),
        catchError(utils.handleError)
      );
  }
}
