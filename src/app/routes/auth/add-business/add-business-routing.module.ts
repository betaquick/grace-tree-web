import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddBusinessComponent } from './add-business.component';

const routes: Routes = [
  {
    path: '',
    component: AddBusinessComponent,
    data: {
      title: 'Add Business Info'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBusinessRoutingModule { }



