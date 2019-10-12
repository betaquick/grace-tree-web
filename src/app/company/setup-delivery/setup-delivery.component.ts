import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStatus, DeliveryStatusCodes, UserDeliveryStatus, NotificationTypes } from '@betaquick/grace-tree-constants';
import { finalize } from 'rxjs/operators';

import { CompanyService } from '../company.service';
import { BusinessInfo } from '../../shared/models/company-model';
import { User, ScheduleDelivery, UserProduct } from '../../shared/models/user-model';
import { Template } from '../../shared/models/template-model';

@Component({
  selector: 'app-setup-delivery',
  templateUrl: './setup-delivery.component.html',
  styleUrls: ['./setup-delivery.component.scss']
})
export class SetupDeliveryComponent implements OnInit {
  loading: boolean;
  userStatus = UserStatus;

  recipient: any;
  company: BusinessInfo;
  crews: User[];
  recipientTemplate: Template;
  recipientProducts: UserProduct[] = [];
  products: UserProduct[] = [];
  crewTemplate: Template;

  delivery: ScheduleDelivery;
  deliveryId: number;
  template: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loading = false;
    this.delivery = new ScheduleDelivery();
    this.delivery.assignedToUserId = -1;

    this.route.paramMap.subscribe((params: ParamMap) => {
      const userId = parseInt(params.get('userId'), 10);
      this.deliveryId = parseInt(params.get('deliveryId'), 10);

      if (userId) {
        this.getDeliveryInfo(userId);
        this.getTemplate();
      } else {
        this.router.navigate(['/company/search']);
      }
    });

    // select all user selected products by default
  }

  getDeliveryInfo(userId: number) {
    this.companyService.getDeliveryInfo(userId)
      .subscribe(
        deliveryInfo => {
          this.recipient = deliveryInfo.recipient;
          this.products = deliveryInfo.recipient.products || [];
          this.recipientProducts = (deliveryInfo.recipient.products || [])
            .filter(p => p.status);
          this.recipient.products = this.recipientProducts;
          this.company = deliveryInfo.company;
          this.crews = deliveryInfo.crews;
        },
        err => {
          this.toastr.error(err);
        }
      );
  }

  getTemplate() {
    this.companyService
      .getTemplates()
      .subscribe(templates => {
        this.recipientTemplate = templates.filter(t => t.notificationType === NotificationTypes.UserDeliveryEmail)[0];
        this.crewTemplate = templates.filter(t => t.notificationType === NotificationTypes.CompanyDeliveryEmail)[0];
      },
      err => this.toastr.error(err));
  }

  isDeliveryAssigned(userId) {
    return parseInt(userId, 10) !== -1;
  }

  scheduleDelivery() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.delivery.statusCode = DeliveryStatusCodes.Scheduled;
    this.delivery.isAssigned = true;

    let scheduleDelivery;
    if (this.deliveryId) {
      this.delivery.userId = this.recipient.userId;
      scheduleDelivery = this.companyService.updateDelivery(this.deliveryId, this.delivery);
    } else {
      this.delivery.userDeliveryStatus = UserDeliveryStatus.Accepted;
      this.delivery.users = [this.recipient.userId];
      scheduleDelivery = this.companyService.scheduleDelivery(this.delivery);
    }

    scheduleDelivery
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.toastr.success('Delivery has been scheduled successfully');
          this.router.navigate(['/company/deliveries']);
        },
        err => this.toastr.error(err)
      );
  }

  openTemplateModal(modal: any, template): void {
    this.template = template;
    modal.show();
  }
}
