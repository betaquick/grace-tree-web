import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../shared/models/user-model';
import { CompanyService } from '../company.service';


@Component({
  selector: 'app-company-crew',
  templateUrl: './company-crew.component.html',
  styleUrls: [
    './company-crew.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CompanyCrewComponent implements OnInit {

  loading: boolean;
  crews: User[];

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loading = false;

    this.crews = [];
    this.getCompanyCrews();
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

  deleteCompanyCrew(crewId: number) {
    this.loading = true;

    this.companyService
      .deleteCompanyCrew(crewId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.toastr.success('Crew deleted successfully');
        this.getCompanyCrews();
      },
      err => this.toastr.error(err)
    );
  }
}
