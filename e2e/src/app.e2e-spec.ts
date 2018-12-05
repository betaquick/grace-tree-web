import { GraceTreeWebPage } from './app.po';

describe('grace-tree-web App', function () {
  let page: GraceTreeWebPage;

  beforeEach(() => {
    page = new GraceTreeWebPage();
  });

  it('should display Angle in h1 tag', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Angle');
  });
});
