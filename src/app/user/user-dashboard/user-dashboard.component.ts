import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SessionStorage } from 'ngx-store';
import * as _ from 'lodash';
import { UserStatus } from '@betaquick/grace-tree-constants';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { User } from '../../shared/models/user-model';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: [
    './user-dashboard.component.scss'
  ]
})
export class UserDashboardComponent implements OnInit, OnDestroy {

  @SessionStorage() user: User = new User();
  status: boolean;
  modal: any;
  pendingCount = 0;
  deliveries = [];
  delivery: any = {};

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.status = this.user.profile.status === UserStatus.Ready ? true : false;

    this.getPendingDeliveries();
    this.getRecentDeliveries();
  }

  ngOnDestroy() {}

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

  updateDelivery({ delivery }) {
    this.router.navigate(['/user/deliveries', delivery.deliveryId]);
  }
}
