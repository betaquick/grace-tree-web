import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, flatMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { SessionStorage } from 'ngx-store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { User, UserProduct, Address } from '../shared/models/user-model';
import { AppConfig } from '../app.config';
import { utils } from '../shared/utils';

@Injectable()
export class UserService implements OnDestroy {

  @SessionStorage() user: User = new User();
  @SessionStorage() userProducts: UserProduct[];

  constructor(
    private http: HttpClient
  ) {}

  ngOnDestroy() {} // event empty method is needed to allow ngx-store handle class destruction

  updateProfile(profile: User) {
    return this.http
      .put(`${AppConfig.API_URL}/user/profile`, profile)
      .pipe(
        flatMap(() => this.fetchUser()),
        map(body => {
          this.user = body;
          return this.user;
        }),
        catchError(utils.handleError)
      );
  }

  updateStatus(status: String) {
    return this.http
      .put(`${AppConfig.API_URL}/user/status/${status}`, null)
      .pipe(
        flatMap(() => this.fetchUser()),
        map(body => {
          this.user = body;
          return this.user;
        }),
        catchError(utils.handleError)
      );
  }

  deactivateAccount(userId: number) {
    return this.http.delete(`${AppConfig.API_URL}/user/${userId}`)
      .pipe(
        catchError(utils.handleError)
      );
  }

  getUserProducts(): Observable<UserProduct[]> {
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

  updateUserAddress(address: any) {
    return this.http
      .put(`${AppConfig.API_URL}/user/address`, address)
      .pipe(
        flatMap(() => this.fetchUser()),
        map(body => {
          this.user = body;
          return this.user;
        }),
        catchError(utils.handleError)
      );
  }

  getPendingDeliveries(): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/user/deliveries/pending`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          const deliveries = _.get(body, 'deliveries');

          return deliveries;
        }),
        catchError(utils.handleError)
      );
  }

  getRecentDeliveries(): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/user/deliveries/recent`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          const deliveries = _.get(body, 'deliveries');

          return deliveries;
        }),
        catchError(utils.handleError)
      );
  }

  getDeliveries(): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/user/deliveries`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          const deliveries = _.get(body, 'deliveries');

          return deliveries;
        }),
        catchError(utils.handleError)
      );
  }

  getDelivery(deliveryId: number): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/user/deliveries/${deliveryId}`)
      .pipe(
        map(response => _.get(response, 'body')),
        catchError(utils.handleError)
      );
  }

  updateDeliveryStatus(deliveryId: number, statusCode: string): Observable<any> {
    return this.http
      .put(`${AppConfig.API_URL}/user/deliveries/${deliveryId}`, { statusCode })
      .pipe(
        map(response => {
          return _.get(response, 'body');
        }),
        catchError(utils.handleError)
      );
  }

  fetchUser(): Observable<User> {
    return this.http.get(`${AppConfig.API_URL}/user/${this.user.userId}`)
      .pipe(
        map(response => {
          this.user = _.get(response, 'body');
          return this.user;
        }),
        catchError(utils.handleError)
      );
  }
}
