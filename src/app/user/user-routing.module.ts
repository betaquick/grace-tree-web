import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContainerComponent } from '../layout/container/container.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthGuard } from '../auth/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NotificationComponent } from './notification/notification.component';
import { UserDeliveriesComponent } from './user-deliveries/user-deliveries.component';
import { UpdateDeliveryComponent } from './user-deliveries/update-delivery/update-delivery.component';

const routes: Routes = [{
  path: 'user',
  component: ContainerComponent,
  canActivate: [AuthGuard],
  children: [{
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: UserDashboardComponent },
      { path: 'deliveries', component: UserDeliveriesComponent },
      { path: 'deliveries/:deliveryId', component: UpdateDeliveryComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'notifications', component: NotificationComponent },
      { path: '**', component: UserDashboardComponent }
    ]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
