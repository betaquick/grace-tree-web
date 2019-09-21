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
  offset = 0;

  recipients = [];
  currentlyShowing = [];
  links = [];
  recipient: any = {};

  loading: boolean;

  searchParams = {
    term: '',
    onlyActive: false
  };

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loading = false;
    this.getAllUsers();
  }

  getNewItemsInView(): void {
    this.currentlyShowing = [...this.recipients
      .slice(this.offset * this.LIMIT,  (this.offset + 1) * this.LIMIT)];
  }

  paginate(evt: { direction: DIRECTIONS, page: number }) {
    const pages = this.howManyPages(this.recipients, this.LIMIT);
    if (!evt) {
      this.currentlyShowing = [...(this.recipients || []).slice(0, this.LIMIT)];
    } else {
      if (evt.page > -1 && evt.page < pages) {
        this.offset = evt.page;
        this.getNewItemsInView();
      } else {
        if (evt.direction === DIRECTIONS.Forwards && (pages > this.offset + 1)) {
          this.offset++;
          this.getNewItemsInView();
        } else if ( evt.direction === DIRECTIONS.Backwards && (this.offset > 0)) {
          this.offset--;
          this.getNewItemsInView();
        }
      }
    }
    this.generatePaginationLinks();
  }

  howManyPages(items: any[] = [], perPage: number): number {
    return (Math.ceil(items.length / perPage));
  }

  generatePaginationLinks(): void {
    const pages = this.howManyPages(this.recipients, this.LIMIT);
    this.links = Array(pages)
      .fill(0)
      .map((e, index) => index);
  }

  getAllUsers() {
    this.loading = true;
    this.companyService.getUsers()
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
          this.recipients = [...data.users];
          this.paginate(null);
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
          this.recipients = [...data.users];
          this.paginate(null);
        },
        err => this.toastr.error(err)
      );
  }

}
