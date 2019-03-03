import { Directive, ElementRef, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { Address } from '../models/user-model';

declare var google: any;

@Directive({
  selector: '[appPlacesAutocomplete]'
})

export class PlacesAutocompleteDirective implements OnInit, AfterViewInit {
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  private element: HTMLInputElement;

  constructor(elRef: ElementRef) {
    // elRef will get a reference to the element where
    // the directive is placed
    this.element = elRef.nativeElement;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.element, {
      componentRestrictions: { country: 'US' }
    });

    autocomplete.setFields(['address_components', 'geometry.location']);

    // Event listener to monitor place changes in the input
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // Emit the new address object for the updated place

      const address = this.getFormattedAddress(autocomplete.getPlace());
      this.setAddress.emit(address);
    });
  }

  // @params: place - Google Autocomplete place object
  // @returns: address - An address object in human readable format
  getFormattedAddress(place) {
    const address: Address = new Address();
    address.longitude = place.geometry.location.lng();
    address.latitude = place.geometry.location.lat();
    address.street = '';

    Object.keys(place.address_components).forEach(key => {
      const item = place.address_components[key];

      if (item['types'].indexOf('locality') > -1) {
        address.city = item['long_name'];
      } else if (item['types'].indexOf('administrative_area_level_1') > -1) {
        address.state = item['short_name'];
      } else if (item['types'].indexOf('street_number') > -1) {
        address.street += `${item['short_name']} `;
      } else if (item['types'].indexOf('route') > -1) {
        address.street += item['long_name'];
      } else if (item['types'].indexOf('postal_code') > -1) {
        address.zip = item['short_name'];
      }
    });

    return address;
  }
}
