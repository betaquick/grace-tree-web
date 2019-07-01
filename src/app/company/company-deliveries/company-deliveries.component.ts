import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionStorage } from 'ngx-store';

import { CompanyService } from '../company.service';
import { User } from '../../shared/models/user-model';

@Component({
  selector: 'app-company-deliveries',
  templateUrl: './company-deliveries.component.html',
  styleUrls: ['./company-deliveries.component.scss']
})
export class CompanyDeliveriesComponent implements OnInit, OnDestroy {

  @SessionStorage() user: User = new User();
  loading: boolean;

  deliveries = [];
  delivery: any = {};
  crews = [];

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getDeliveries();
    this.getCompanyCrews();
  }

  getDeliveries() {
    this.loading = true;

    this.companyService.getDeliveries()
      .pipe(finalize(() => this.loading = false))
      .subscribe(deliveries => this.deliveries = deliveries,
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

  getCrewMemberName(id: number) {
    const crewMember = [...this.crews, this.user].filter(c => c.userId === id)[0];
    if (crewMember) {
      return `${crewMember.firstName} ${crewMember.lastName}`;
    }
    return 'Unknown Crew Member';
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

  ngOnDestroy(): void {}
}
