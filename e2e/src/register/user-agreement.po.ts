import { by, element, $$ } from 'protractor';

export class UserAgreementPage {


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

  get agreeButton() {
    return element(by.css('button[type="submit"]'));
  }

  errorMessage() {
    return element(by.css('.alert-warning strong'));
  }

  agreementText() {
    return $$('h3.text-center.txt-primary').first().getText();
  }

  fillAgreementForm({ firstName, lastName }) {
    $$(`input[type="checkbox"]`).click();
    element(by.css('input[placeholder="[Your First Name] [Your Last Name]"]')).sendKeys(`${firstName} ${lastName}`);
  }

}
