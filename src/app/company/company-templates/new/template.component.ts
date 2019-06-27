import { Component, OnInit } from '@angular/core';
import { finalize, catchError } from 'rxjs/operators';
import { EnumValues } from 'enum-values';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


import { CompanyService } from '../../company.service';
import { Template } from '../../../shared/models/template-model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/if';

enum Placeholders {
  RecipientFirstName = '{{RECIPIENTFIRSTNAME}}',
  RecipientLastName = '{{RECIPIENTLASTNAME}}',
  RecipientPhoneNumber = '{{RECIPIENTPHONENUMBER}}',
  RecipientAddress = '{{RECIPIENTADDRESS}}',
  CompanyName = '{{COMPANYNAME}}',
  CompanyAddress = '{{COMPANYADDRESS}}',
  AdditionalRecipientText = '{{ADDITIONALRECIPIENTTEXT}}',
  AdditionalCompanyText = '{{ADDITIONALCOMPANYTEXT}}',
  AssignedUserFirstName = '{{ASSIGNEDUSERFIRSTNAME}}',
  AssignedUserLastName = '{{ASSIGNEDUSERLASTNAME}}',
  AssignedUserPhoneNumber = '{{ASSIGNEDUSERPHONENUMBER}}'
  }

@Component({
  selector: 'app-new-company-template',
  templateUrl: './template.component.html',
  styleUrls: [
    '../company-templates.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class NewCompanyTemplateComponent implements OnInit {

  loading: boolean;
  template: Template;
  placeholders: {name: string; value: string}[] = [];

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loading = false;
    this.placeholders = EnumValues.getNamesAndValues(Placeholders);

    this.activatedRoute.data.pipe(
      switchMap((data: { edit: boolean }) => {
        return Observable.if(
          () => data.edit,
          this.getTemplate(),
          of(new Template())
        );
      }),
      catchError(err => {
        this.router.navigate(['company', 'templates']).catch();
        return Observable.throw(err);
      })
    )
      .subscribe(template => {
        this.template = template;
      });
  }

  public handleDragStart(evt: DragEvent) {
    evt.dataTransfer.setData('text', (evt.target as HTMLLabelElement).dataset['value']);
    evt.dataTransfer.dropEffect = 'copy';
  }

  submitForm() {
    if (this.template.templateId) {
      this.updateTemplate();
    } else {
      this.addTemplate();
    }
  }

  addTemplate() {
    if (this.loading === true) {
      return;
    }

    this.loading = true;

    this.companyService.addCompanyTemplate(this.template)
    .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.toastr.success('Template added successfully');
          this.router.navigate(['/company/templates']);
        },
        err => this.toastr.error(err)
      );
  }

  updateTemplate() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const template = _.omit(this.template, ['createdAt', 'userId']);
    this.companyService.updateCompanyTemplate(this.template.templateId, template)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.toastr.success('Template updated successfully');
          this.router.navigate(['/company/templates']);
        },
        err => this.toastr.error(err)
      );
  }

  getTemplate(): Observable<Template> {
    return this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        if (isNaN(+params.get('templateId'))) {
          throw new Error('Invalid Template Id');
        } else {
          return this.companyService.getTemplate(+params.get('templateId'));
        }
      })
    );
  }
}
