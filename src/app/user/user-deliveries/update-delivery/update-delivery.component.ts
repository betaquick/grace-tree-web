import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStatus, DeliveryStatusCodes } from '@betaquick/grace-tree-constants';
import { finalize } from 'rxjs/operators';
import { SessionStorage } from 'ngx-store';

import { UserService } from '../../user.service';
import { User, UserProduct } from '../../../shared/models/user-model';

@Component({
  selector: 'app-update-delivery',
  templateUrl: './update-delivery.component.html',
  styleUrls: ['./update-delivery.component.scss']
})
export class UpdateDeliveryComponent implements OnInit, OnDestroy {
  loading: boolean;

  userStatus = UserStatus;
  statusCodes = DeliveryStatusCodes;

  @SessionStorage() user: User = new User();

  delivery: any = {};
  userProducts: Array<UserProduct> = [];

  statusCode: string;
  deliveryId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loading = false;
    this.statusCode = '';

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deliveryId = parseInt(params.get('deliveryId'), 10);

      if (this.deliveryId) {
        this.getDelivery(this.deliveryId);
        this.getUserProducts();
      } else {
        this.router.navigate(['/user/deliveries']);
      }
    });
  }

  ngOnDestroy() {}

  getDelivery(deliveryId: number) {
    this.userService.getDelivery(deliveryId)
      .subscribe(
        delivery => this.delivery = delivery,
        err => this.toastr.error(err)
      );
  }

  getUserProducts() {
    this.userService.getUserProducts()
      .subscribe(
        userProducts => this.userProducts = userProducts,
        err => this.toastr.error(err)
      );
  }

  updateDelivery() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.userService.updateDeliveryStatus(this.deliveryId, this.statusCode)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.delivery.statusCode = this.statusCode;
          this.toastr.success('Delivery status updated successfully');
        },
        err => this.toastr.error(err)
      );
  }
}
