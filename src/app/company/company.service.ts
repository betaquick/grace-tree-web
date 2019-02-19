import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { SessionStorage } from 'ngx-store';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { User, RegisterUser, ScheduleDelivery } from '../shared/models/user-model';
import { AppConfig } from '../app.config';
import { utils } from '../shared/utils';
import { BusinessInfo } from '../shared/models/company-model';


@Injectable()
export class CompanyService {
  @SessionStorage() company: BusinessInfo;

  constructor(
    private http: HttpClient
  ) { }

  getCompanyInfo(): Observable<BusinessInfo> {
    if (this.company) {
      return of(this.company);
    }

    return this.http.get(`${AppConfig.API_URL}/user/company`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          const company = _.get(body, 'company');
          this.company = company;

          return company;
        }),
        catchError(utils.handleError)
      );
  }

  updateCompanyInfo(company: BusinessInfo, user: User) {
    return this.http
      .put(`${AppConfig.API_URL}/user/company`, { company, user })
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          user = _.get(body, 'user');
          this.company = _.get(body, 'company');

          return { user, company: this.company };
        }),
        catchError(utils.handleError)
      );
  }

  getCompanyCrews(): Observable<User[]> {
    return this.http.get(`${AppConfig.API_URL}/user/company/crews`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          const crews = _.get(body, 'crews');

          return crews;
        }),
        catchError(utils.handleError)
      );
  }

  deleteCompanyCrew(crewId: number) {
    return this.http.delete(`${AppConfig.API_URL}/user/company/crews/${crewId}`)
      .pipe(
        catchError(utils.handleError)
      );
  }

  addCompanyCrew(crew: RegisterUser) {
    return this.http
      .post(`${AppConfig.API_URL}/user/company/crews`, crew)
      .pipe(
        catchError(utils.handleError)
      );
  }

  searchUsers(address: string, radius: number): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/search?address=${address}&radius=${radius}`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');

          return body;
        }),
        catchError(utils.handleError)
      );
  }

  getDeliveryInfo(userId: number): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/user/company/delivery-info/${userId}`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          return body;
        }),
        catchError(utils.handleError)
      );
  }

  scheduleDelivery(delivery: ScheduleDelivery) {
    return this.http
      .post(`${AppConfig.API_URL}/user/company/delivery`, delivery)
      .pipe(
        catchError(utils.handleError)
      );
  }

  getDeliveries(): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/user/company/deliveries`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          const deliveries = _.get(body, 'deliveries');

          return deliveries;
        }),
        catchError(utils.handleError)
      );
  }

  getPendingDeliveries(): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/user/company/deliveries/pending`)
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
    return this.http.get(`${AppConfig.API_URL}/user/company/deliveries/recent`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');
          const deliveries = _.get(body, 'deliveries');

          return deliveries;
        }),
        catchError(utils.handleError)
      );
  }
}
