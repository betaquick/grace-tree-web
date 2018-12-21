import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { UserTypes } from '@betaquick/grace-tree-constants';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Authentication',
      status: false
    },
    children: [
      {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
      },
      {
        path: 'register',
        loadChildren: './registration/registration.module#RegistrationModule',
        data: {
          title: 'User Registration',
          userType: UserTypes.General
        }
      },
      {
        path: 'tree-service/register',
        loadChildren: './registration/registration.module#RegistrationModule',
        data: {
          title: 'Tree Service Registration',
          userType: UserTypes.TreeAdmin
        }
      },
      {
        path: 'tree-service/business/add',
        loadChildren: './add-business/add-business.module#AddBusinessModule',
        data: {
          title: 'Add Business Information'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
