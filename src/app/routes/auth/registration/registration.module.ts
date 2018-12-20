import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { RegistrationRoutingModule } from './registration-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    SharedModule
  ],
  declarations: [RegistrationComponent]
})
export class RegistrationModule { }
