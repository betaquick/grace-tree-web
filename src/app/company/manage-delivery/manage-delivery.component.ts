import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserStatus, UserDeliveryStatus } from '@betaquick/grace-tree-constants';

import { CompanyService } from '../company.service';

@Component({
  selector: 'app-manage-delivery',
  templateUrl: './manage-delivery.component.html',
  styleUrls: ['./manage-delivery.component.scss']
})
export class ManageDeliveryComponent implements OnInit {

  loading: boolean;

  public userStatus = UserStatus;
  public userDeliveryStatus = UserDeliveryStatus;

  deliveries = [];
  deliveryId: number;

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
      } else {
        this.router.navigate(['/company/deliveries']);
      }
    });
  }

  getDelivery(deliveryId: number) {
    this.loading = true;

    this.companyService.getDelivery(deliveryId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(deliveries => this.deliveries = deliveries,
        err => this.toastr.error(err)
      );
  }

  cancelDelivery(deliveryId: number) {
  }
}
