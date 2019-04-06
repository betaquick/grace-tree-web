export class State {
  name: string;
  abbr: string;
}

export class BusinessInfo {
  companyId?: number;
  companyName: string;
  website: string;
  companyAddressId?: number;
  companyAddress: string;
  city: string;
  state: string;
  zip: string;
  latitude?: string;
  longitude?: string;

  constructor() {
    this.companyAddress = '';
  }
}
