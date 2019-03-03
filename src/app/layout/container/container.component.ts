import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionStorage } from 'ngx-store';

import { User } from '../../shared/models/user-model';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, OnDestroy {

  @SessionStorage() user: User = new User();

  constructor() {}

  ngOnInit() {
  }

  ngOnDestroy() {}

}
