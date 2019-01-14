import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SessionStorage } from 'ngx-store';
import * as _ from 'lodash';

import { UserService } from '../user.service';
import { User } from '../../shared/models/user-model';
import { UserStatus } from '@betaquick/grace-tree-constants';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: [
    './user-dashboard.component.scss'
  ]
})
export class UserDashboardComponent implements OnInit {

  @SessionStorage() user: User = new User();
  status: boolean;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.status = this.user.status === UserStatus.Ready ? true : false;
  }

  updateStatus(value: boolean) {
    this.status = value;
    const status = value ? UserStatus.Ready : UserStatus.Pause;

    this.userService.updateStatus(status)
      .subscribe(
        () => {
          this.toastr.success('Status updated successfully');
        },
        err => {
          this.toastr.error(err);
          this.status = !value;
        }
      );
  }
}
