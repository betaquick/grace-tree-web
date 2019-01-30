import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { UiSwitchModule } from 'ngx-ui-switch';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAddressComponent } from './user-address/user-address.component';
import { UserService } from './user.service';
import { NotificationComponent } from './notification/notification.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    CustomFormsModule,
    UiSwitchModule,
    SharedModule
  ],
  providers: [UserService],
  declarations: [UserDashboardComponent, UserProfileComponent, NotificationComponent, UserAddressComponent]
})
export class UserModule { }
