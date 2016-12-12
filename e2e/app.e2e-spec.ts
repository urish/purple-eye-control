import { PurpleEyeControlPage } from './app.po';

describe('purple-eye-control App', function() {
  let page: PurpleEyeControlPage;

  beforeEach(() => {
    page = new PurpleEyeControlPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
