import { GraceTreeWebPage } from './app.po';
import { browser } from 'protractor';

describe('Grace Tree Web App', function () {
  let page: GraceTreeWebPage;

  beforeEach(() => {
    page = new GraceTreeWebPage();
  });

  it('should navigate to sign up page', () => {
    page.navigateTo();

    expect(browser.getCurrentUrl()).toEqual('http://localhost:4206/signup');
  });
});
