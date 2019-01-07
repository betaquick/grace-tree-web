import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { User } from '../shared/models/user-model';
import { AppConfig } from '../app.config';
import { utils } from '../shared/utils';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  updateProfile(profile: User) {
    return this.http
      .put(`${AppConfig.API_URL}/user`, profile)
      .pipe(
        map(response => {
          const user = _.get(response, 'body.user');
          this.authService.setUser(user);

          return user;
        }),
        catchError(utils.handleError)
      );
  }
}
