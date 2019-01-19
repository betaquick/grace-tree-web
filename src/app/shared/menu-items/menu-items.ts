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
  }]
};

const ADMIN_MENU = {
  label: 'Navigation',
  main: [{
    state: 'search',
    main_state: 'company',
    short_label: 'D',
    name: 'Search',
    type: 'sub',
    icon: 'ti-search'
  },
  {
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
  }]
};

const CREW_MENU = {
  label: 'Navigation',
  main: [{
    state: 'search',
    main_state: 'company',
    short_label: 'D',
    name: 'Search',
    type: 'sub',
    icon: 'ti-search'
  },
  {
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
  }]
};

@Injectable()
export class MenuItems {

  userType: UserTypes;

  constructor() {}

  getAll(userType: UserTypes): Menu {
    if (userType === UserTypes.General) {
      return USER_MENU;

    } else if (userType === UserTypes.TreeAdmin) {
      return ADMIN_MENU;

    } else {
      return CREW_MENU;

    }
  }
}
