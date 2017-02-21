import { customEvent, PollyfillHistoryPushState } from 'src/polyfill.js';

describe('src/index.js', () => {
  describe('PollyfillHistoryPushState', () => {
    describe('restore', () => {
      it('Should remove the custom event on restore', () => {
        const pollyfillHistoryPushState = PollyfillHistoryPushState();
        pollyfillHistoryPushState.fill();
        pollyfillHistoryPushState.restore();
        const eventSpy = sinon.spy();

        window.addEventListener('__f8-history-push-state', eventSpy);
        history.pushState({ index: '/context.html' }, 'Home', '/context.html');
        window.removeEventListener('__f8-history-push-state', eventSpy);

        expect(eventSpy.called).to.equal(false);
      });
    });

    describe('fill', () => {
      it('Should add a custome event when the history pushState method is called', () => {
        const pollyfillHistoryPushState = PollyfillHistoryPushState();
        pollyfillHistoryPushState.fill();
        const eventSpy = sinon.spy();

        window.addEventListener('__f8-history-push-state', eventSpy);
        history.pushState({ index: '/context.html' }, 'Home', '/context.html');

        expect(eventSpy.called).to.equal(true);
        window.removeEventListener('__f8-history-push-state', eventSpy);
      });
    });
  });

  describe('customEvent', () => {
    it('Should return false if "window.CustomEvent" is a function', () => {
      window.CustomEvent = function () {};
      expect(customEvent()).to.equal(false);
    });

    it('Should add a "customEvent" polyfill', done => {
      window.CustomEvent = false;
      customEvent();

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
