import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage, SessionStorage } from 'ngx-store';
import { UserStatus } from '@betaquick/grace-tree-constants';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { User, UserProduct } from '../../shared/models/user-model';
import { finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: [
    './user-dashboard.component.scss'
  ]
})
export class UserDashboardComponent implements OnInit, OnDestroy {

  @SessionStorage() user: User = new User();
  @LocalStorage() defaultStateChanged = false;
  @ViewChild('modalDefault') modalDefault: ModalBasicComponent;
  status: boolean;
  pendingCount = 0;
  deliveries = [];
  delivery: any = {};
  userProducts: UserProduct[] = [];
  isLoading = false;

  updateUserState: Observable<boolean> = new Observable((observer: any) => {
    this.isLoading = true;

    if (!this.status) {
      this.modalDefault.show();
    } else {
      return this.updateStatus(UserStatus.Pause).subscribe(observer);
    }
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.status = this.user.profile.status === UserStatus.Ready;

    this.getPendingDeliveries();
    this.getRecentDeliveries();
    this.getUserProducts();
  }

  ngOnDestroy() {
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


  updateStatus(status: string): Observable<boolean> {
    return this.userService.updateStatus(status)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (this.modalDefault) {
            this.modalDefault.hide();
          }
        }),
        tap(
          () => {
            this.toastr.success('Status updated successfully');
            this.defaultStateChanged = true;

            return of(true);
          },
          err => {
            this.toastr.error(err);

            return of(false);
          },
          () => {
            this.status = this.user.profile.status === UserStatus.Ready;
            if (this.modalDefault) {
              this.modalDefault.hide();
            }
          }
        ));
  }

  goToReady() {
    if (this.modalDefault) {
      this.modalDefault.hide();
    }
    this.updateStatus(UserStatus.Ready).subscribe();
  }

  getUserProducts() {
    this.userService
      .getUserProducts()
      .subscribe(
        userProducts => this.userProducts = userProducts,
        err => this.toastr.error(err)
      );
  }

  handleDeliveryPreference(newProductsWithStatus) {
    this.userService.updateUserProducts(newProductsWithStatus)
      .subscribe(
        (updatedProducts) => {
          this.userProducts = [...updatedProducts]; // trigger refresh
          this.toastr.success('Delivery preference updated successfully');
        },
        err => {
          this.toastr.error(err);
          this.getUserProducts();
        }
      );
  }

  closeModal() {
    this.isLoading = false;
    if (this.modalDefault) {
      this.modalDefault.hide();
    }
  }

  updateDelivery({ delivery }) {
    this.router.navigate(['/user/deliveries', delivery.deliveryId]);
  }
}
