import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  @LocalStorage() token: string;

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.token) {
      req = req.clone({headers: req.headers.set('Authorization', this.token)});
    }

    return next.handle(req);
  }
}
