import { browser, by, element, $$ } from 'protractor';

export class UserRegistrationPage {

  randomString = Math.random().toString(36).slice(-5);

  newUser = {
    firstName: 'Samuel',
    lastName: 'Peters',
    phone: '555-1784-394',
    email: `samuelpeters${this.randomString}@gmail.com`,
    password: '1q2w3e4r5t',
    confirmPassword: '1q2w3e4r5t',
    timeZone: 'America/Denver'
  };

  existingUser = {
    firstName: 'Samuel',
    lastName: 'Peters',
    phone: '555-1784-394',
    email: 'admin@fccc.net',
    password: '1q2w3e4r5t',
    confirmPassword: '1q2w3e4r5t',
    timeZone: 'America/Denver'
  };

  wrongDetails = {
    firstName: 'Samuel',
    lastName: 'Peters',
    phone: '555-1784-394',
    email: 'admin@fccc.net',
    password: 'password',
    confirmPassword: 'passwordmismatch',
    timeZone: 'America/Denver'
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

  userRegistrationText() {
    return $$('h3.text-left').first().getText();
  }

  fillRegistrationForm(credentials = this.newUser) {
    element(by.css('input[name="firstName"]')).sendKeys(credentials.firstName);
    element(by.css('input[name="lastName"]')).sendKeys(credentials.lastName);
    element(by.css('input[name="email"]')).sendKeys(credentials.email);
    element(by.css('input[name="secondaryemail"]')).sendKeys(credentials.email);
    element(by.css('input[name="number"]')).sendKeys(credentials.phone);
    element(by.css('input[name="cell_number"]')).sendKeys(credentials.phone);
    element(by.css('input[name="work_number"]')).sendKeys(credentials.phone);
    element(by.css('input[name="password"]')).sendKeys(credentials.password);
    element(by.css('input[name="confirmPassword"]')).sendKeys(credentials.confirmPassword);
  }

}
