import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError, flatMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { SessionStorage } from 'ngx-store';
import { Observable } from 'rxjs/Observable';

import { User, RegisterUser, ScheduleDelivery } from '../shared/models/user-model';
import { AppConfig } from '../app.config';
import { utils } from '../shared/utils';
import { BusinessInfo } from '../shared/models/company-model';
import { Template } from '../shared/models/template-model';
import { UserStatus } from '@betaquick/grace-tree-constants';

@Injectable()
export class CompanyService implements OnDestroy {

  @SessionStorage() company: BusinessInfo;
  @SessionStorage() user: User = new User();

  constructor(
    private http: HttpClient
  ) { }

  ngOnDestroy() {} // event empty method is needed to allow ngx-store handle class destruction

  updateCompanyInfo(company: BusinessInfo, user: User) {
    return this.http
      .put(`${AppConfig.API_URL}/user/company`, { company, user })
      .pipe(
        flatMap(() => this.fetchUserData(null)),
        map(response => {
          return response;
        }),
        catchError(utils.handleError)
      );
  }

  updateProfile(profile: User) {
    return this.http
      .put(`${AppConfig.API_URL}/user/profile`, profile)
      .pipe(
        flatMap(() => this.fetchUserData(null)),
        map(response => {
          return response;
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

  getTemplates(): Observable<Template[]> {
    return this.http.get(`${AppConfig.API_URL}/user/company/templates`)
      .pipe(
        map(response => response['body']['templates']),
        catchError(utils.handleError)
      );
  }

  getTemplate(templateId: number): Observable<Template> {
    return this.http.get(`${AppConfig.API_URL}/user/company/templates/${templateId}`)
      .pipe(
        map(response => response['body']['template']),
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

  updateCompanyTemplate(templateId: number, template: Partial<Template>) {
    return this.http
      .put(`${AppConfig.API_URL}/user/company/templates/${templateId}`, template)
      .pipe(
        catchError(utils.handleError)
      );
  }

  searchUsers(address: string, radius: number, includePause: boolean): Observable<any> {
    return this.http
      .get(`${AppConfig.API_URL}/search?address=${address}&radius=${radius}&includePause=${includePause}`)
      .pipe(
        map(response => {
          const body = _.get(response, 'body');

          return body;
        }),
        catchError(utils.handleError)
      );
  }

  getUsers(onlyActive?: boolean, searchTerm?: string) {
    let params = new HttpParams();

    if (searchTerm) {
      params = params.append('term', searchTerm);
    }

    if (onlyActive) {
      params = params.append('status', UserStatus.Ready);
    }
    return this.http
      .get(`${AppConfig.API_URL}/users`, { params })
      .pipe(
        map(response => _.get(response, 'body')),
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
      .post(`${AppConfig.API_URL}/user/company/deliveries`, delivery)
      .pipe(
        catchError(utils.handleError)
      );
  }

  getDeliveries(): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/user/company/deliveries`)
      .pipe(
        map(response => {
          const deliveries = _.get(response, 'body.deliveries');

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

  getDelivery(deliveryId: number): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/user/company/deliveries/${deliveryId}`)
      .pipe(
        map(response => _.get(response, 'body')),
        catchError(utils.handleError)
      );
  }

  updateDelivery(deliveryId: number, delivery: ScheduleDelivery) {
    return this.http
      .put(`${AppConfig.API_URL}/user/company/deliveries/${deliveryId}`, delivery)
      .pipe(
        catchError(utils.handleError)
      );
  }

  fetchUserData(userId?: number): Observable<User> {
    return this.http.get(`${AppConfig.API_URL}/user/${userId || this.user.userId}`)
      .pipe(
        map(response => {
          if (!userId) {
            this.user = _.get(response, 'body');
            this.company = _.get(response, 'body.company');
          }
          return {user: _.get(response, 'body'), company: _.get(response, 'body.company')};
        }),
        catchError(utils.handleError)
      );
  }
}
