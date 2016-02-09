describe('the landing view', function() {

  beforeEach(function(){
    browser.get('#/');
  });

  it('should load the login template', function(){
    expect(element(by.id('login')).isPresent()).toBe(true);
  });
});