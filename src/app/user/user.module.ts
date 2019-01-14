import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { UiSwitchModule } from 'ngx-ui-switch';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    CustomFormsModule,
    UiSwitchModule.forRoot({
      color: '#3F99FF'
    })
  ],
  providers: [UserService],
  declarations: [UserDashboardComponent, UserProfileComponent]
})
export class UserModule { }
