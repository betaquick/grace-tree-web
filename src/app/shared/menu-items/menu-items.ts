import { Injectable} from '@angular/core';
import { UserTypes } from '@betaquick/grace-tree-constants';

export interface MainMenuItems {
  state: string;
  main_state: string;
  short_label?: string;
  name: string;
  type: string;
  icon: string;
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const USER_MENU = {
  label: 'Navigation',
  main: [{
    state: '',
    main_state: 'user',
    short_label: 'D',
    name: 'Dashboard',
    type: 'sub',
    icon: 'ti-home'
  },
  {
    state: 'profile',
    main_state: 'user',
    short_label: 'P',
    name: 'Profile',
    type: 'link',
    icon: 'ti-layout-cta-right'
  },
  {
    state: 'notifications',
    main_state: 'user',
    short_label: 'N',
    name: 'Notifications',
    type: 'link',
    icon: 'ti-view-grid'
  }],
};

const COMPANY_MENU = {
  label: 'Navigation',
  main: [{
    state: 'dashboard',
    main_state: 'company',
    short_label: 'D',
    name: 'Dashboard',
    type: 'sub',
    icon: 'ti-home'
  },
  {
    state: 'deliveries',
    main_state: 'company',
    short_label: 'D',
    name: 'Deliveries',
    type: 'link',
    icon: 'ti-layout'
  },
  {
    state: 'profile',
    main_state: 'company',
    short_label: 'P',
    name: 'Profile',
    type: 'link',
    icon: 'ti-layout-cta-right'
  },
  {
    state: 'crews',
    main_state: 'company',
    short_label: 'C',
    name: 'Crews',
    type: 'link',
    icon: 'ti-view-grid'
  }],
};

@Injectable()
export class MenuItems {
  
  userType: UserTypes;
  
  constructor(userType: UserTypes) {
    this.userType = userType;
  }

  getAll(): Menu {
    return (this.userType === UserTypes.General) ? USER_MENU : COMPANY_MENU;
  }
}
