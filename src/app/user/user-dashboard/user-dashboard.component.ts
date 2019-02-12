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
  modal: any;
  pendingCount = 0;
  deliveries = [];
  delivery: any = {};

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.status = this.user.status === UserStatus.Ready ? true : false;

    this.getPendingDeliveries();
    this.getRecentDeliveries();
  }

  getPendingDeliveries() {
    this.userService.getPendingDeliveries()
      .subscribe(
        deliveries => this.pendingCount = deliveries.length,
        err => this.toastr.error(err)
      );
  }

  getRecentDeliveries() {
    this.userService.getRecentDeliveries()
      .subscribe(
        deliveries => this.deliveries = deliveries,
        err => this.toastr.error(err)
      );
  }

  updateUserState(value: boolean, modal) {
    const status = value ? UserStatus.Ready : UserStatus.Pause;

    if (status === UserStatus.Ready) {
      this.modal = modal;
      modal.show();
    } else {
      this.updateStatus(status);
    }
  }

  updateStatus(status: string) {
    this.userService.updateStatus(status)
      .subscribe(
        () => {
          this.status = status === UserStatus.Ready ? true : false;
          this.toastr.success('Status updated successfully');

          if (this.modal) {
            this.modal.hide();
          }
        },
        err => {
          this.toastr.error(err);

          if (this.modal) {
            this.modal.hide();
          }
        }
      );
  }

  closeModal() {
    this.status = false;

    this.modal.hide();
  }

  openModal(modal: any, delivery) {
    this.delivery = delivery;

    modal.show();
  }
}
