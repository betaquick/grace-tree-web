import { by, element, $$ } from 'protractor';

export class UserRegistrationPage {
  wrongDetails = {
    firstName: 'Samuel',
    lastName: 'Peters',
    phone: '+12133734253',
    phone2: '+12133734254',
    phone3: '+12133734255',
    email: 'admin@grace.tree',
    email2: 'developer@stack.net',
    password: 'password',
    confirmPassword: 'passwordmismatch',
    timeZone: 'America/Denver'
  };

  get registerButton() {
    return element(by.css('button[type="submit"]'));
  }

  newUser = (i: number = 0) => ({
    firstName: 'Samuel',
    lastName: 'Peters',
    phone: `+1213373425${i}`,
    phone2: `+1213373426${i}`,
    phone3: `+1213373427${i}`,
    email: `developer${i}@skills.net`,
    email2: `developer${i}@stack.net`,
    password: '1q2w3e4r5t',
    confirmPassword: '1q2w3e4r5t',
    timeZone: 'America/Denver'
  })



  errorMessage() {
    return element(by.css('.alert-warning strong'));
  }

  errorToast() {
    return element(by.css('div.toast-message.ng-star-inserted'));
  }

  validationErrorMessage() {
    return element(by.css('.alert.alert-danger.background-danger'));
  }

  userRegistrationText() {
    return $$('h3.text-left').first().getText();
  }

  fillRegistrationForm(credentials = this.newUser()) {
    element(by.css('input[name="firstName"]')).sendKeys(credentials.firstName);
    element(by.css('input[name="lastName"]')).sendKeys(credentials.lastName);
    element(by.css('input[name="email"]')).sendKeys(credentials.email);
    element(by.css('input[name="secondaryemail"]')).sendKeys(credentials.email2);
    element(by.css('input[name="number"]')).sendKeys(credentials.phone);
    element(by.css('input[name="cell_number"]')).sendKeys(credentials.phone2);
    element(by.css('input[name="work_number"]')).sendKeys(credentials.phone3);
    element(by.css('input[name="password"]')).sendKeys(credentials.password);
    element(by.css('input[name="confirmPassword"]')).sendKeys(credentials.confirmPassword);
  }

}
