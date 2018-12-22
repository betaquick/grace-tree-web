import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeliveryComponent } from './delivery.component';

const routes: Routes = [
  {
    path: '',
    component: DeliveryComponent,
    data: {
      title: 'Add Delivery Info'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule { }



