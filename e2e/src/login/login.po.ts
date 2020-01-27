import { browser, by, element, $$ } from 'protractor';

export class LoginPage {

  invalidCredentials = {
    email: 'getpeid@gmail.com',
    password: 'n07COr33C7'
  };

  validCredentials = {
    email: `developer@gmail.com`,
    password: '1q2w3e4r5t'
  };

  navigateTo() {
    return browser.get('/login');
  }

  get loginButton() {
    return element(by.css('button.btn-primary'));
  }

  errorMessage() {
    return element(by.css('div.toast-message'));
  }

  signInText() {
    return $$('h3.text-left.txt-primary').first().getText();
  }

  fillLoginForm(credentials = this.validCredentials) {
    element(by.css('#email')).sendKeys(credentials.email);
    element(by.css('#password')).sendKeys(credentials.password);
  }
}
