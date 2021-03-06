import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './signup/signup.component';
import { UserBaseRegistrationComponent } from './user-registration/user-base-registration';
import { UserRegistrationComponent } from './user-registration/registration/user-registration.component';
import { AddDeliveryComponent } from './user-registration/add-delivery/add-delivery.component';
import { UserVerificationComponent } from './user-registration/verification/user-verification.component';
import { AgreementComponent } from './user-registration/agreement/agreement.component';
import { CompanyBaseRegistrationComponent } from './company-registration/company-base-registration';
import { CompanyRegistrationComponent } from './company-registration/registration/company-registration.component';
import { AddBusinessComponent } from './company-registration/add-business/add-business.component';
import { CompanyVerificationComponent } from './company-registration/verification/company-verification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DeliveryRequestComponent } from './delivery-request/delivery-request.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset/:token', component: ResetPasswordComponent },
  { path: 'request/user/:userId/delivery/:deliveryId', component: DeliveryRequestComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'user-registration',
    component: UserBaseRegistrationComponent,
    children: [
      { path: '', component: UserRegistrationComponent },
      { path: 'add-delivery', component: AddDeliveryComponent },
      { path: 'agreement', component: AgreementComponent },
      { path: 'verification', component: UserVerificationComponent },
      { path: 'verification/:verifyType/:token', component: UserVerificationComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  {
    path: 'company-registration',
    component: CompanyBaseRegistrationComponent,
    children: [
      { path: '', component: CompanyRegistrationComponent },
      { path: 'add-business', component: AddBusinessComponent },
      { path: 'verification', component: CompanyVerificationComponent },
      { path: 'verification/:verifyType/:token', component: CompanyVerificationComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
