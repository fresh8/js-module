import { customEvent } from 'src/polyfill.js';

describe('src/index.js', () => {
  describe('customEvent', () => {
    it('Should return false if "window.CustomEvent" exists', () => {
      expect(customEvent()).to.equal(false);
    });

    it('Should add a "customEvent" polyfill', done => {
      window.addEventListener('test', fired);

      function fired (event) {
        expect(event.message).to.equal('You got my message');
        window.removeEventListener('test', fired);
        done();
      }

      const testEvent = new CustomEvent('test');
      testEvent.message = 'You got my message';
      window.dispatchEvent(testEvent);
    });
  });
});
