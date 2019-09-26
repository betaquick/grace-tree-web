import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Template } from '../../shared/models/template-model';
import { CompanyService } from '../company.service';
import { NotificationTypes } from '@betaquick/grace-tree-constants';


@Component({
  selector: 'app-company-templates',
  templateUrl: './company-templates.component.html',
  styleUrls: [
    './company-templates.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CompanyTemplateComponent implements OnInit {

  loading: boolean;
  templates: Template[];
  grouped_templates: Template[][] = [];

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService
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
      .subscribe(templates => {
        this.groupTemplates(templates);
        this.templates = templates;
      },
      err => this.toastr.error(err)
    );
  }

  groupTemplates(templates: Template[]) {
    this.grouped_templates = [
      [
        templates.find(t => t.notificationType === NotificationTypes.CompanyDeliveryEmail),
        templates.find(t => t.notificationType === NotificationTypes.CompanyDeliveryEmail),
      ],

      [
        templates.find(t => t.notificationType === NotificationTypes.CrewRegistrationEmail),
        templates.find(t => t.notificationType === 'CREW REGISTRATION SMS'),
      ],

      [
        templates.find(t => t.notificationType === NotificationTypes.CompanyDeliveryRequestEmail),
        templates.find(t => t.notificationType === NotificationTypes.DeliveryRequestAcceptanceEmail),
      ],

      [
        templates.find(t => t.notificationType === NotificationTypes.DeliveryRequestSMS),
        templates.find(t => t.notificationType === NotificationTypes.DeliveryRequestAcceptanceSMS),
      ],

      [
        templates.find(t => t.notificationType === NotificationTypes.UserRegistrationAdminEmail),
        templates.find(t => t.notificationType === 'NOTIFY ADMIN OF USER REGISTRATION SMS'),
      ],

      [
        templates.find(t => t.notificationType === NotificationTypes.UserStatusEmail),
        templates.find(t => t.notificationType === NotificationTypes.UserDeliveryEmail),
        templates.find(t => t.notificationType === NotificationTypes.DeliveryWarningEmail),
        templates.find(t => t.notificationType === 'USER STATUS UPDATE SMS'),
        templates.find(t => t.notificationType === NotificationTypes.UserDeliverySMS),
        templates.find(t => t.notificationType === NotificationTypes.DeliveryWarningSMS),
      ]

    ];
  }
}
