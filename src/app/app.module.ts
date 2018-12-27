import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { WebStorageModule } from 'ngx-store';
import { ClickOutsideModule } from 'ng-click-outside';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CustomFormsModule } from 'ng2-validation';

import { TitleComponent } from './layout/title/title.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { httpInterceptorProviders } from './http-interceptor';
import { layoutProviders, ToastrConfig } from './layout';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    TitleComponent
  ],
  providers: [
    httpInterceptorProviders,
    layoutProviders
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PerfectScrollbarModule,
    ClickOutsideModule,
    ToastrModule.forRoot(ToastrConfig),
    WebStorageModule,
    CustomFormsModule,
    AuthModule,
    UserModule,
    CompanyModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
