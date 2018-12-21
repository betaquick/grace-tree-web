import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = AuthService.getToken();

    if (authToken) {
      req = req.clone({headers: req.headers.set('Authorization', authToken)});
    }

    return next.handle(req);
  }
}
