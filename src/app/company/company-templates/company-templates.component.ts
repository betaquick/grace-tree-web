import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Template } from '../../shared/models/template-model';
import { CompanyService } from '../company.service';


@Component({
  selector: 'app-company-crew',
  templateUrl: './company-templates.component.html',
  styleUrls: [
    './company-templates.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CompanyTemplateComponent implements OnInit {

  loading: boolean;
  templates: Template[];

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loading = false;

    this.templates = [];
    this.getTemplates();
  }

  getTemplates() {
    this.loading = true;

    this.companyService
      .getTemplates()
      .pipe(finalize(() => this.loading = false))
      .subscribe(templates => this.templates = templates,
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
        this.getTemplates();
      },
      err => this.toastr.error(err)
    );
  }
}
