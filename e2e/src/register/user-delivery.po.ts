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
    getEstimateInfo: 'false',
    self_pickup: 'false',
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
    element(by.css('input[name="street"]')).sendKeys(delivery.street);
    element(by.css('input[name="city"]')).sendKeys(delivery.city);
    element(by.css('input[name="zip"]')).sendKeys(delivery.zip);

    element(by.css('textarea[name="deliveryInstruction"]')).sendKeys(delivery.deliveryInstruction);

    element(by.css('select[ng-reflect-name="product0"]')).sendKeys(delivery.product0);
    element(by.css('select[ng-reflect-name="product1"]')).sendKeys(delivery.product1);
    element(by.css('select[ng-reflect-name="product2"]')).sendKeys(delivery.product2);
    element(by.css('select[ng-reflect-name="product3"]')).sendKeys(delivery.product3);
    element(by.css('select[ng-reflect-name="product4"]')).sendKeys(delivery.product4);
    element(by.css('select[ng-reflect-name="product5"]')).sendKeys(delivery.product5);
    element(by.css('select[ng-reflect-name="product6"]')).sendKeys(delivery.product6);

    element(by.css(`input[name="getEstimateInfo"][value="${delivery.getEstimateInfo}"]`)).click();
    element(by.css(`input[name="self_pickup"][value="${delivery.self_pickup}"]`)).click();
  }

}
