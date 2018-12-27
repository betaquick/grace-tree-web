import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';

import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { CompanyBaseRegistrationComponent } from './company-registration/company-base-registration';
import { CompanyRegistrationComponent } from './company-registration/registration/company-registration.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AddBusinessComponent } from './company-registration/add-business/add-business.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomFormsModule,
    AuthRoutingModule
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  declarations: [
    LoginComponent,
    UserRegistrationComponent,
    CompanyBaseRegistrationComponent,
    CompanyRegistrationComponent,
    AddBusinessComponent
  ]
})
export class AuthModule {}
