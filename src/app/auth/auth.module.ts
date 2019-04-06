import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { UserBaseRegistrationComponent } from './user-registration/user-base-registration';
import { UserRegistrationComponent } from './user-registration/registration/user-registration.component';
import { AddDeliveryComponent } from './user-registration/add-delivery/add-delivery.component';
import { AgreementComponent } from './user-registration/agreement/agreement.component';
import { CompanyBaseRegistrationComponent } from './company-registration/company-base-registration';
import { CompanyRegistrationComponent } from './company-registration/registration/company-registration.component';
import { AuthGuard } from './auth.guard';
import { AddBusinessComponent } from './company-registration/add-business/add-business.component';
import { CompanyVerificationComponent } from './company-registration/verification/company-verification.component';
import { UserVerificationComponent } from './user-registration/verification/user-verification.component';
import { AuthService } from './auth.service';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DeliveryRequestComponent } from './delivery-request/delivery-request.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomFormsModule,
    AuthRoutingModule,
    SharedModule,
    GooglePlaceModule
  ],
  providers: [
    AuthGuard,
    AuthService
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UserBaseRegistrationComponent,
    UserRegistrationComponent,
    AddDeliveryComponent,
    AgreementComponent,
    CompanyBaseRegistrationComponent,
    CompanyRegistrationComponent,
    AddBusinessComponent,
    CompanyVerificationComponent,
    UserVerificationComponent,
    SignupComponent,
    DeliveryRequestComponent,
    LogoutComponent
  ]
})
export class AuthModule {}
