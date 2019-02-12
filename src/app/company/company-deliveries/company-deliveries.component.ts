import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

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

  openModal(modal: any, delivery) {
    this.delivery = delivery;

    modal.show();
  }
}
