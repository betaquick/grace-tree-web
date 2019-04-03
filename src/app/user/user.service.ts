import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
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
          user.profile.status = _.get(body, 'user.profile.status');
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

  getUserAddress(): Observable<Address> {
    return this.http.get(`${AppConfig.API_URL}/user/address`)
      .pipe(
        map(response => {
          return _.get(response, 'body');
        }),
        catchError(utils.handleError)
      );
  }

  updateUserAddress(address: any) {
    return this.http
      .put(`${AppConfig.API_URL}/user/address`, address)
      .pipe(
        map(response => {
          return _.get(response, 'body');
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
}
