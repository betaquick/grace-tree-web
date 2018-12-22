import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

import { IUser, IAddress } from '../meta-data/user';
import { AppConfig } from '../../app.config';

export const TOKEN_NAME = 'jwt_token';
export const USER_DATA = 'user';

export interface Credentials {
  user: IUser;
  token: string;
}

export interface ResetCredentials {
  token?: string;
  password?: string;
  confirmPassword?: string;
}

export interface BusinessInfo {
  companyId?: number;
  companyName?: string;
  website?: string;
  companyAddress?: number;
  userRole?: string;
  city?: string;
  state?: string;
  zip?: string;
}


@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {
  }

  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this._isLoggedIn.asObservable();
  }

  private _user = new BehaviorSubject<any>({});

  get user() {
    return this._user.asObservable();
  }

  public static getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  private static setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  private static setUser(user: any): void {
    localStorage.setItem(USER_DATA, user);
  }

  private static removeTokens(): void {
    localStorage.clear();
  }

  private static getTokenExpirationDate(token: string): Date {
    try {
      const decoded: any = jwt_decode(token);

      if (!decoded.exp) {
        return null;
      }

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);

      return date;
    } catch (e) {
      return null;
    }
  }

  private static getUserFromLocalStorage(): any {
    return localStorage.getItem(USER_DATA);
  }

  // Check if token is not expired...
  private static tokenNotExpired(): boolean {
    const token = AuthService.getToken();

    if (!token) {
      return false;
    }

    const token_date = AuthService.getTokenExpirationDate(token);

    if (!token_date) {
      return false;
    }

    return token_date.valueOf() > new Date().valueOf();
  }

  public sync(): boolean {
    const response = AuthService.tokenNotExpired();

    if (response === true) {
      // update pointers
      this._user.next(JSON.parse(AuthService.getUserFromLocalStorage()));
      this._isLoggedIn.next(true);
    }
    return response;
  }

  // Login User...
  login(user: { email: string; password: string }): Observable<Credentials> {
    return this.http.post(`${AppConfig.API_URL}/auth/login`, user)
      .pipe(
        map(response => response['body']),
        tap(credentials => {
          AuthService.setToken(credentials.token);
          AuthService.setUser(JSON.stringify({
            userId: credentials.user.userId,
            firstName: credentials.user.firstnname,
            lastName: credentials.user.lastnname,
            email: credentials.user.email
          }));

          this._isLoggedIn.next(true);
        })
      ) as Observable<Credentials>;
  }

  // Register User...
  register(user: IUser): Observable<Credentials> {
    return this.http.post(`${AppConfig.API_URL}/auth/register`, user)
      .pipe(
        map(response => response['body']),
        tap(credentials => {
          AuthService.setToken(credentials.token);
          AuthService.setUser(JSON.stringify({
            userId: credentials.user.userId,
            firstName: credentials.user.firstnname,
            lastName: credentials.user.lastnname,
            email: credentials.user.email
          }));

          this._isLoggedIn.next(true);
        })
      ) as Observable<Credentials>;
  }

  // Add business info...
  addBusinessInfo(businessInfo: BusinessInfo): Observable<any> {
    return this.http.post(`${AppConfig.API_URL}/user/business`, businessInfo)
      .pipe(
        map(response => response['body'])
      );
  }

  // Add business info...
  getProducts(): Observable<any> {
    return this.http.get(`${AppConfig.API_URL}/products`)
      .pipe(
        map(response => response['body']['products'])
      );
  }
  

  // Add business info...
  addDeliveryInfo(deliveryInfo: {products: any, address: IAddress }): Observable<any> {
    return this.http.post(`${AppConfig.API_URL}/user/new-delivery-info`, deliveryInfo)
      .pipe(
        map(response => response['body'])
      );
  }

  // Request Password for password reset...
  requestResetPasswordToken(email: string): Observable<any> {
    return this.http.post(`${AppConfig.API_URL}/auth/forgot-password`, {email})
      .pipe(
        map(response => response['message']),
      ) as Observable<any>;
  }


  // Confirm Password for password reset...
  confirmResetPasswordToken(token: string): Observable<IUser> {
    return this.http.get(`${AppConfig.API_URL}/auth/reset/${token}`)
      .pipe(
        map(response => response['body']['user']),
      ) as Observable<IUser>;
  }


  // Reset Password...
  resetPassword(body: ResetCredentials): Observable<any> {
    return this.http.post(`${AppConfig.API_URL}/auth/reset`, body)
      .pipe(
        map(response => response['message']),
      ) as Observable<any>;
  }


  // Logout User...
  logout(): Observable<boolean> {
    AuthService.removeTokens();
    this._user.next({});
    this._isLoggedIn.next(false);

    return of(true);
  }
}
