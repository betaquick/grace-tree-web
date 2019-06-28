import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company-deliveries',
  templateUrl: './company-deliveries.component.html',
  styleUrls: ['./company-deliveries.component.scss']
})
export class CompanyDeliveriesComponent implements OnInit {

  loading: boolean;

  deliveries = [];
  delivery: any = {};

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getDeliveries();
  }

  getDeliveries() {
    this.loading = true;

    this.companyService.getDeliveries()
      .pipe(finalize(() => this.loading = false))
      .subscribe(deliveries => this.deliveries = deliveries,
        err => this.toastr.error(err)
      );
  }

  openModal(modal: any, data) {
    const { action, delivery, link } = data;

    if (action === 'link') {
      this.router.navigate(link || ['/company/deliveries', delivery.deliveryId]);

      return;
    }

    this.delivery = delivery;

    modal.show();
  }
}
