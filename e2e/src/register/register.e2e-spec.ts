import { $, browser, ExpectedConditions } from 'protractor';
import { RegisterPage } from './register.po';
import { UserRegistrationPage } from './user-registration.po';

describe('Register Page', function() {
  let registerPage: RegisterPage;

  beforeEach(() => {
    registerPage = new RegisterPage();
    registerPage.navigateTo();
    // Ensures preloader has been completely removed from the page
    browser.wait(ExpectedConditions.visibilityOf($('.login-card')));
  });

  it('should show Register text', async () => {
    expect(registerPage.registerText()).toBe('Sign Up');
  });

  describe('register as user', async () => {
    let userRegistrationPage: UserRegistrationPage;

    beforeEach(() => {
      registerPage.registerAsUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf($('h3.text-left')));

      userRegistrationPage = new UserRegistrationPage();
    });

    it('should show page correctly', () => {
      expect(userRegistrationPage.userRegistrationText()).toBe('User Registration');
    });

    it('should show error message if passwords mismatch', async () => {
      userRegistrationPage.fillRegistrationForm(userRegistrationPage.wrongDetails);

      browser.wait(ExpectedConditions.visibilityOf(userRegistrationPage.validationErrorMessage()));
      expect(userRegistrationPage.validationErrorMessage().getText()).toContain('Password is not the same');
    });

    it('should register successfully with valid user credentials', async () => {
      userRegistrationPage.fillRegistrationForm(userRegistrationPage.newUser);

      userRegistrationPage.registerButton.click();
      browser.waitForAngularEnabled(false);

      browser.wait(ExpectedConditions.urlContains('add-delivery'));
      expect(browser.getCurrentUrl()).toContain('/user-registration/add-delivery');

      // Remove the logged in user
      browser.executeScript('window.localStorage.clear();');
    });
  });
});
