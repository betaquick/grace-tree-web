import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { UserStatus } from '@betaquick/grace-tree-constants';

import { CompanyService } from '../company.service';


enum DIRECTIONS {
  Backwards,
  Forwards
}

@Component({
    selector: 'app-company-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['../../../assets/icon/icofont/css/icofont.scss',
      './users-list.component.scss']
})
export class CompanyUsersListComponent implements OnInit {
  public DIRECTIONS = DIRECTIONS;
  userStatus = UserStatus;
  LIMIT = 10;
  offset = 1;

  users = [];
  currentlyShowing = [];
  links = [];

  loading: boolean;

  searchParams = {
    term: '',
    onlyActive: false
  };

  recipient: any = {};

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loading = false;
    this.getAllUsers();
  }

  openNote(modal: any, recipient) {
    this.recipient = recipient;
    modal.show();
  }

  getAllUsers() {
    this.loading = true;
    this.companyService.getUsers()
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
          this.users = data.users;
          this.offset = 1;
        },
        err => this.toastr.error(err)
      );
  }

  search() {
    this.loading = true;

    const { term, onlyActive } = this.searchParams;

    this.companyService.getUsers(onlyActive, term)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
          if (_.size(data.users) === 0) {
            this.toastr.warning('No users found.');
          }
          this.users = data.users;
          this.offset = 1;
        },
        err => this.toastr.error(err)
      );
  }

}
