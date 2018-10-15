context('Standardised', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000/demo-server/standardised');
  });

  it('API should exist', () => {
    return cy.window().then(window => {
      expect(window).to.have.property('fresh8');
      expect(window.fresh8).to.have.property('remove');
      expect(window.fresh8).to.have.property('reloadAllAds');
      expect(window.fresh8).to.have.property('requestAd');
    });
  });

  it('Should allow you to request an ad', () => {
    return cy.window().then(window => {
      return window.fresh8
        .requestAd({slotID: 'f8-004', appendPoint: 'body', view: 'football'})
        .then(ad => ad.destroy());
    });
  });

  it('Should allow you to reload the ads', () => {
    return cy.window().then(window => {
      return window.fresh8.reloadAllAds();
    });
  });

  it('Should allow you to remove the ads', () => {
    cy.window().should(window => {
      expect(() => {
        return window.fresh8.remove();
      }).to.not.throw();
    });
  });
});
