import { $$, browser, by, element } from 'protractor';

export class RegisterPage {

  navigateTo() {
    return browser.get('/signup');
  }

  get registerAsUserButton() {
    return element(by.css('button[ng-reflect-router-link="/user-registration"]'));
  }

  get registerAsCompanyButton() {
    return element(by.css('button[ng-reflect-router-link="/company-registration"]'));
  }


  errorMessage() {
    return element(by.css('div.toast-message')).getText();
  }

  registerText() {
    return $$('h3.text-left.txt-primary').first().getText();
  }
}
