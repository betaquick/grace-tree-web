import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent implements OnInit {

  status: boolean;
  modal: any;
  pendingCount = 0;
  totalCount = 0;
  deliveries = [];
  delivery: any = {};

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getDeliveries();
    this.getPendingDeliveries();
    this.getRecentDeliveries();
  }

  getDeliveries() {
    this.companyService.getDeliveries()
      .subscribe(
        deliveries => this.totalCount = deliveries.length,
        err => this.toastr.error(err)
      );
  }

  getPendingDeliveries() {
    this.companyService.getPendingDeliveries()
      .subscribe(
        deliveries => this.pendingCount = deliveries.length,
        err => this.toastr.error(err)
      );
  }

  getRecentDeliveries() {
    this.companyService.getRecentDeliveries()
      .subscribe(
        deliveries => this.deliveries = deliveries,
        err => this.toastr.error(err)
      );
  }

  openModal(modal: any, data) {
    const { action, delivery } = data;

    if (action === 'link') {
      this.router.navigate(['/company/deliveries', delivery.deliveryId]);

      return;
    }

    this.delivery = delivery;

    modal.show();
  }
}
