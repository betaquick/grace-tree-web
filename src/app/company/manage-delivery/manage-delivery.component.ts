import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserStatus, UserDeliveryStatus, DeliveryStatusCodes } from '@betaquick/grace-tree-constants';

import { SessionStorage } from 'ngx-store';
import { CompanyService } from '../company.service';
import { BusinessInfo as Company } from '../../shared/models/company-model';
import { User, UserProduct } from '../../shared/models/user-model';
import * as _ from 'lodash';

@Component({
  selector: 'app-manage-delivery',
  templateUrl: './manage-delivery.component.html',
  styleUrls: ['./manage-delivery.component.scss']
})
export class ManageDeliveryComponent implements OnInit, OnDestroy {

  loading: boolean;

  public userStatus = UserStatus;
  public userDeliveryStatus = UserDeliveryStatus;
  public statusCodes = DeliveryStatusCodes;

  deliveries = [];
  delivery: any = {};
  crews: User[] = [];
  products: UserProduct[] = [];
  recipients: User[] = [];
  deliveryId: number;
  isScheduled: boolean;

  @SessionStorage() company: Company = new Company();
  @SessionStorage() user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = false;

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deliveryId = parseInt(params.get('deliveryId'), 10);

      if (this.deliveryId) {
        this.getDelivery(this.deliveryId);
        this.getCompanyCrews();
      } else {
        this.router.navigate(['/company/deliveries']);
      }
    });
  }

  getDelivery(deliveryId: number) {
    this.loading = true;

    this.companyService.getDelivery(deliveryId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(deliveries => {
        this.deliveries = deliveries;
        this.delivery = deliveries[0];
        this.products = this.delivery.products;
        this.isScheduled = this.deliveries[0].statusCode === DeliveryStatusCodes.Scheduled;
      },
        err => this.toastr.error(err)
      );
  }

  getCompanyCrews() {
    this.loading = true;

    this.companyService
      .getCompanyCrews()
      .pipe(finalize(() => this.loading = false))
      .subscribe(crews => this.crews = crews,
      err => this.toastr.error(err)
    );
  }

  updateDelivery() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    const data: any = _.pick(this.delivery, ['details', 'isAssigned', 'deliveryId', 'statusCode',
    'assignedToUserId', 'userId', 'recipientMessage', 'crewMessage']);
    data.userDeliveryStatus = this.delivery.deliveryStatus;
    data.assignedByUserId = this.user.userId || this.delivery.assignedByUserId;
    data.details = this.delivery.details || '';
    data.products = this.delivery.deliveryProducts;
    this.companyService.updateDelivery(this.deliveryId, data)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.toastr.success('Delivery Updated successfully');
          setTimeout(() =>
            this.router.navigate(['company', 'deliveries']), 300);
        },
        err => this.toastr.error(err)
      );
  }

  compareFn(product: UserProduct, selected: UserProduct | number ): boolean {
    if (typeof selected === 'number') {
      return product.productId === selected;
    }
    return product.productId === selected.productId;
  }

  ngOnDestroy(): void {}
}
