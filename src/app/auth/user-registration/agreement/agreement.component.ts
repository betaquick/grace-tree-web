import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, flatMap } from 'rxjs/operators';

import { UserTypes } from '@betaquick/grace-tree-constants';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: [
    './agreement.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  styles: [
    ` .wrong__name { border-color: #dc3545 !important; } `
  ]
})
export class AgreementComponent implements OnInit {
  @ViewChildren('term') termsCheckboxes: QueryList<{ nativeElement: HTMLInputElement }>;
  loading: boolean;
  clientName: string;
  expectedName: string;

  get allTermsAgreed(): boolean {
    if (this.termsCheckboxes) {
      return this.termsCheckboxes.toArray().every(input => input.nativeElement.checked);
    }
    return false;
  }

  get correctName(): boolean {
    const { user } = this.authService;
    return (this.clientName || '').toLowerCase() === `${user.firstName} ${user.lastName}`.toLowerCase();
  }

  terms = [
    'I am responsible to maintain my profile up to date with all of my current information.',
    'I am responsible to maintain my correct status for a delivery - “Ready” or “Pause”',
    'I am responsible to mark all attempted deliveries as successful or unsuccessful on my account',
    // tslint:disable-next-line: max-line-length
    '*GraceTreeProducts Arborist Products & Services (AKA gracetreeservices.com), is a free, information management service designed to put people that want Arborist & other products in touch with people and/or companies (Mostly Arborists & Landscapers), that have those products to give away. GraceTreeProducts has no employees and has no authority over the Arborists/Landscapers and others that participate in the program. They subscribe to the program just like you do. Should any issues or problems arise or result regarding any aspect of a delivery, those should be resolved between the recipient and the delivering party/Arborist/Landscaper or whoever (company or driver), that is making the delivery. ',
    'I have read, understand and agree with all of the'
    + ' Terms and Conditions of the GraceTreeProducts program, signified by my checking of each one.'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loading = false;
    this.expectedName = `${this.authService.user.firstName} ${this.authService.user.lastName}`;
  }

  acceptAgreement() {
    if (this.loading || !this.correctName || !this.allTermsAgreed) {
      return;
    }
    this.loading = true;

    this.authService.acceptAgreement()
      .pipe(
        flatMap(() => this.authService.fetchUser()),
        finalize(() => this.loading = false)
      )
      .subscribe(
        user => {
          if (user.userType === UserTypes.TreeAdmin || user.userType === UserTypes.Crew) {
            this.router.navigate(['/company']);
          } else {
            this.router.navigate(['/user']);
          }
        },
        err => this.toastr.error(err)
      );
  }
}
