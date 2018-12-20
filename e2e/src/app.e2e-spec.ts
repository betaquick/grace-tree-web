import { GraceTreeWebPage } from './app.po';

describe('grace-tree-web App', function () {
  let page: GraceTreeWebPage;

  beforeEach(() => {
    page = new GraceTreeWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
