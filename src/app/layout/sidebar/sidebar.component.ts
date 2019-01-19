import { Component, OnInit, Input } from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';

import { User } from '../../shared/models/user-model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() user: User;
  menuItems: MenuItems;

  constructor() {
  }

  ngOnInit() {
    this.menuItems = new MenuItems();
  }
}
