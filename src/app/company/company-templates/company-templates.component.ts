import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
    private router: Router
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

  duplicateTemplate(templateId: number) {
    if (this.loading) {
      return;
    }
    this.loading = true;

    this.companyService
      .duplicateCompanyTemplate(templateId)
      .pipe(finalize(() => this.loading = false))
      .subscribe((template: Template) => {
        this.toastr.success('Template Duplicated successfully');
        this.router.navigate(['company', 'templates', template.templateId]);
      },
      err => this.toastr.error(err)
    );
  }
}
