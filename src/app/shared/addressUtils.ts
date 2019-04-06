import { Address as PlacesAddress } from 'ngx-google-places-autocomplete/objects/address';
import * as _ from 'lodash';

import { Address } from './models/user-model';

export const addressUtils = {

  convertAddress(place: PlacesAddress) {
    const address: Address = new Address();

    address.longitude = _.toString(place.geometry.location.lng());
    address.latitude = _.toString(place.geometry.location.lat());

    _.map(place.address_components, address_component => {

      if (_.find(address_component.types, type => type === 'street_number')) {
        address.street += address_component.long_name;
      }
      if (_.find(address_component.types, type => type === 'route')) {
        address.street += ` ${address_component.long_name}`;
      }
      if (_.find(address_component.types, type => type === 'locality')) {
        address.city = address_component.long_name;
      }
      if (_.find(address_component.types, type => type === 'administrative_area_level_1')) {
        address.state = address_component.short_name;
      }
      if (_.find(address_component.types, type => type === 'postal_code')) {
        address.zip = address_component.long_name;
      }
    });

    return address;
  }
};
