import { $, browser, ExpectedConditions } from 'protractor';
import { RegisterPage } from './register.po';
import { UserRegistrationPage } from './user-registration.po';
import { UserDeliveryPage } from './user-delivery.po';
import { UserAgreementPage } from './user-agreement.po';

describe('Register Page', function() {
  let registerPage: RegisterPage;

  beforeEach(() => {
    registerPage = new RegisterPage();
    registerPage.navigateTo();
    // Ensures preloader has been completely removed from the page
    browser.wait(ExpectedConditions.visibilityOf($('.login-card')));
  });

  it('should show register text', () => {
    expect(registerPage.registerText()).toBe('Sign Up');

  });

  describe('User Registration Page', async () => {
    let userRegistrationPage: UserRegistrationPage;

    beforeEach(() => {
      registerPage.registerAsUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf($('h3.text-left')));

      userRegistrationPage = new UserRegistrationPage();

    });

    it('should show user registration text', () => {
      expect(userRegistrationPage.userRegistrationText()).toBe('User Registration');

    });

    describe('Invalid User Registration', () => {
      it('should show error message if passwords mismatch', () => {
        userRegistrationPage.fillRegistrationForm(userRegistrationPage.wrongDetails);

        browser.wait(ExpectedConditions.visibilityOf(userRegistrationPage.validationErrorMessage()));
        expect(userRegistrationPage.validationErrorMessage().getText()).toContain('Password is not the same');

      });

    });

    describe('Valid User Registration', () => {

      describe('succeeds', async () => {
        let userDeliveryPage: UserDeliveryPage;
        let i = 0;

        beforeEach(() => {
          userRegistrationPage.fillRegistrationForm(userRegistrationPage.newUser(i));

          userRegistrationPage.registerButton.click();
          browser.waitForAngularEnabled(false);
          browser.wait(ExpectedConditions.urlContains('/add-delivery'));

          userDeliveryPage = new UserDeliveryPage();
          i++;

        });

        it('should navigate to delivery page', () => {
          expect(browser.getCurrentUrl()).toContain('/user-registration/add-delivery');
        });

        describe('Delivery Page', () => {

          it('should show delivery text', () => {
            expect(userDeliveryPage.deliveryText()).toBe('Delivery Address');
          });

          describe('Invalid Delivery Registration', () => {

          });

          describe('Valid Delivery Registration', () => {

            describe('succeeds', () => {
              let userAgreementPage: UserAgreementPage;

              beforeEach(() => {
                userDeliveryPage.fillDeliveryForm(userDeliveryPage.delivery);

                userRegistrationPage.registerButton.click();
                browser.waitForAngularEnabled(false);

                browser.wait(ExpectedConditions.urlContains('/agreement'));

                userAgreementPage = new UserAgreementPage();
              });

              it('should navigate to agreement page', () => {
                expect(browser.getCurrentUrl()).toContain('/user-registration/agreement');
              });

              describe('User Agreement Page', () => {
                it('should show agreement text', () => {
                  expect(userAgreementPage.agreementText()).toBe('Terms and Conditions');
                });

                describe('Agree To Terms & Condition', () => {
                  describe('succeeds', () => {
                    it('should navigate to verification page', () => {
                      userAgreementPage.fillAgreementForm(userRegistrationPage.newUser());
                      userAgreementPage.agreeButton.click();

                      browser.waitForAngularEnabled(false);
                      browser.wait(ExpectedConditions.urlContains('/verification'));

                      expect(browser.getCurrentUrl()).toContain('/verification');
                    });
                  });
                });
              });
            });
          });

        });
      });

      describe('fails', () => {
        beforeEach(() => {
          userRegistrationPage.fillRegistrationForm(userRegistrationPage.newUser());

          userRegistrationPage.registerButton.click();
          browser.waitForAngularEnabled(false);
        });

        it('should show email taken error', () => {
          browser.wait(ExpectedConditions.visibilityOf(userRegistrationPage.errorToast()));

          expect(userRegistrationPage.errorToast().getText()).toBe(
            `Email address(es) ${userRegistrationPage.newUser().email}, ${userRegistrationPage.newUser().email2} have already been taken`
          );

        });
      });

    });

  });
});
