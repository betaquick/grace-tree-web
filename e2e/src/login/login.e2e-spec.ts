import { $, browser, ExpectedConditions } from 'protractor';
import { LoginPage } from './login.po';

describe('Login Page', function () {
  let loginPage: LoginPage;

  beforeEach(async () => {
    loginPage = new LoginPage();
    loginPage.navigateTo();
    // Ensures preloader has been completely removed from the page
    browser.wait(ExpectedConditions.visibilityOf($('.login-card')));
  });

  it('should show sign in text', async () => {
    expect(loginPage.signInText()).toBe('Sign In');
  });

  it('should show error message with invalid login details', () => {
    loginPage.fillLoginForm(loginPage.invalidCredentials);
    loginPage.loginButton.click();
    browser.wait(ExpectedConditions.visibilityOf(loginPage.errorMessage()));
    expect(loginPage.errorMessage().getText()).toBe('Incorrect user credentials');
  });

  it('should login successfully with valid login details', async () => {
    loginPage.fillLoginForm();
    loginPage.loginButton.click();
    browser.waitForAngularEnabled(false);
    browser.wait(ExpectedConditions.urlContains('/user'));
    expect(browser.getCurrentUrl()).toContain('/user');
  });

});
