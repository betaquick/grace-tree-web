import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { User } from '../shared/models/user-model';
import { AppConfig } from '../app.config';
import { utils } from '../shared/utils';
import { Observable } from 'rxjs/Observable';
import { BusinessInfo } from '../shared/models/company-model';
import { SessionStorage } from 'ngx-store';
import { of } from 'rxjs/observable/of';

@Injectable()
export class CompanyService {

  @SessionStorage() user: User = new User();
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
          this.user = _.get(body, 'user');
          this.company = _.get(body, 'company');

          return body;
        }),
        catchError(utils.handleError)
      );
  }
}
