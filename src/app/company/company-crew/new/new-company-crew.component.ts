import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { RegisterUser } from '../../../shared/models/user-model';
import { CompanyService } from '../../company.service';

@Component({
  selector: 'app-new-company-crew',
  templateUrl: './new-company-crew.component.html',
  styleUrls: [
    './new-company-crew.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class NewCompanyCrewComponent implements OnInit {

  loading: boolean;
  crew: RegisterUser;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loading = false;

    this.crew = new RegisterUser();
  }

  addCompanyCrew() {
    if (this.loading === true) {
      return;
    }

    if (this.crew.password !== this.crew.confirmPassword) {
      return;
    }

    this.loading = true;

    this.companyService.addCompanyCrew(this.crew)
    .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.toastr.success('Crew added successfully');
          this.router.navigate(['/company/crews']);
        },
        err => this.toastr.error(err)
      );
  }
}
