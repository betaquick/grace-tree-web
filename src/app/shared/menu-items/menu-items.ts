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
    state: 'deliveries',
    main_state: 'user',
    short_label: 'D',
    name: 'Deliveries',
    type: 'link',
    icon: 'ti-layout'
  },
  {
    state: 'profile',
    main_state: 'user',
    short_label: 'P',
    name: 'Profile',
    type: 'link',
    icon: 'ti-layout-cta-right'
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
  },
  {
    state: 'templates',
    main_state: 'company',
    short_label: 'T',
    name: 'Templates',
    type: 'link',
    icon: 'ti-agenda'
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
    state: 'crew-profile',
    main_state: 'company',
    short_label: 'P',
    name: 'Profile',
    type: 'link',
    icon: 'ti-layout-cta-right'
  }]
};

const USERSMENUWHITELIST = [
  'gracetrees@gmail.com'
];

const ADMIN_WITH_USERS_LIST_MENU = {
  label: 'Navigation',
  main: [{
  state: 'users-list',
  main_state: 'company',
  short_label: 'U',
  name: 'Users',
  type: 'link',
  icon: 'ti-user'
  }, ...ADMIN_MENU.main, ]};

@Injectable()
export class MenuItems {

  userType: UserTypes;

  constructor() {}

  getAll({ userType, email }): Menu {
    if (userType === UserTypes.General) {
      return USER_MENU;

    } else if (userType === UserTypes.TreeAdmin) {
      if (USERSMENUWHITELIST.indexOf(email) > -1) {
        return ADMIN_WITH_USERS_LIST_MENU;
      }
      return ADMIN_MENU;

    } else {
      return CREW_MENU;

    }
  }
}
