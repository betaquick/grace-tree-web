import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { UserBaseRegistrationComponent } from './user-registration/user-base-registration';
import { UserRegistrationComponent } from './user-registration/registration/user-registration.component';
import { AddDeliveryComponent } from './user-registration/add-delivery/add-delivery.component';
import { AgreementComponent } from './user-registration/agreement/agreement.component';
import { CompanyBaseRegistrationComponent } from './company-registration/company-base-registration';
import { CompanyRegistrationComponent } from './company-registration/registration/company-registration.component';
import { AddBusinessComponent } from './company-registration/add-business/add-business.component';
import { VerificationComponent } from './verification/verification.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'user-registration',
    component: UserBaseRegistrationComponent,
    children: [
      { path: '', component: UserRegistrationComponent },
      { path: 'add-delivery', canActivateChild: [AuthGuard], component: AddDeliveryComponent },
      { path: 'agreement', canActivateChild: [AuthGuard], component: AgreementComponent }
    ]
  },
  {
    path: 'company-registration',
    component: CompanyBaseRegistrationComponent,
    children: [
      { path: '', component: CompanyRegistrationComponent },
      { path: 'add-business', canActivateChild: [AuthGuard], component: AddBusinessComponent }
    ]
  },
  { path: 'verification', canActivateChild: [AuthGuard], component: VerificationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
