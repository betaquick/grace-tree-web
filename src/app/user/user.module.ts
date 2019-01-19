import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { UiSwitchModule } from 'ngx-ui-switch';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserService } from './user.service';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    CustomFormsModule,
    UiSwitchModule
  ],
  providers: [UserService],
  declarations: [UserDashboardComponent, UserProfileComponent, NotificationComponent]
})
export class UserModule { }
