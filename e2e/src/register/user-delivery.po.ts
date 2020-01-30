import { browser, by, element, $$ } from 'protractor';

export class UserDeliveryPage {

  randomString = Math.random().toString(36).slice(-5);

  delivery = {
    street: 'East Rosario Road',
    city: 'Douglas',
    state: 'Arizona',
    zip: '85607',
    deliveryInstruction: 'Call before coming',
    product0: 'Yes',
    product1: 'Yes',
    product2: 'Yes',
    product3: 'Yes',
    product4: 'Yes',
    product5: 'Yes',
    product6: 'Yes',
    getEstimateInfo: 'Yes',
    self_pickup: 'No',
  };

  navigateTo() {
    return browser.get('/user-registration');
  }

  get registerButton() {
    return element(by.css('button[type="submit"]'));
  }

  errorMessage() {
    return element(by.css('.alert-warning strong'));
  }

  validationErrorMessage() {
    return element(by.css('.alert.alert-danger.background-danger'));
  }

  deliveryText() {
    return $$('h3.text-left').first().getText();
  }

  fillDeliveryForm(delivery = this.delivery) {
    element(by.css('input[name="city"]')).sendKeys(delivery.city);
  }

}
