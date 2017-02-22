import Fresh8 from 'src/index.js';

describe('src/index.js', () => {
  describe('Fresh8', () => {
    it('Should return a new instance of the class when initialised', () => {
      const fresh8 = new Fresh8({ instID: '123' });
      expect(fresh8).to.be.instanceOf(Fresh8);
      fresh8.remove();
    });

    it('Should bind to "__f8-history-push-state" when "listenOnPushState" is true', done => {
      const fresh8 = new Fresh8({ instID: '123', listenOnPushState: true });
      const onHistoryPushStateChangeSpy = sinon.spy();
      fresh8.reloadAllAds = onHistoryPushStateChangeSpy;

      function handlehistoryPushState () {
        expect(onHistoryPushStateChangeSpy.called).to.equal(true);
        fresh8.remove();
        window.removeEventListener('__f8-history-push-state', handlehistoryPushState);
        done();
      }

      window.addEventListener('__f8-history-push-state', handlehistoryPushState);
      history.pushState({ index: '/context.html' }, 'Home', '/context.html');
    });

    describe('requestAd', () => {
      it('Should throw error if no options are passed', () => {
        const fresh8 = new Fresh8({ instID: '123' });

        return fresh8
          .requestAd()
          .catch(reason => {
            expect(reason.name).to.equal('invaildeConfig');
            expect(reason.message).to.equal('Missing "slotID"');
            fresh8.remove();
          });
      });

      it('Should make a request for the ad with the options passed', () => {
        const fresh8 = new Fresh8({ instID: '123' });
        const loadSpy = sinon.spy();

        fresh8.Ad.prototype.load = function () {
          loadSpy();
          return Promise.resolve();
        };

        return fresh8
          .requestAd({ slotID: '312', appendPoint: 'body' })
          .then(() => {
            fresh8.ads[0].destroy = () => {};
            expect(loadSpy.called).to.equal(true);
            expect(fresh8.ads.length).to.equal(1);
            fresh8.remove();
          });
      });
    });

    describe('remove', () => {
      it('Should call restore the history push state if "listenOnPushState" was set', () => {
        const fresh8 = new Fresh8({ instID: '123' });
        const eventSpy = sinon.spy();

        fresh8.remove();
        window.addEventListener('__f8-history-push-state', eventSpy);
        history.pushState({ index: '/context.html' }, 'Home', '/context.html');
        window.removeEventListener('__f8-history-push-state', eventSpy);

        expect(eventSpy.called).to.equal(false);
      });
    });

    describe('reloadAllAds', () => {
      it('Should call the reload method on each ad that is currently active', () => {
        const fresh8 = new Fresh8({ instID: '123' });
        const reloadSpyOne = sinon.spy();
        const reloadSpyTwo = sinon.spy();

        fresh8.ads = [
          { active: true, reload: reloadSpyOne, destroy: () => {} },
          { active: false, reload: reloadSpyTwo, destroy: () => {} }
        ];

        return fresh8
          .reloadAllAds()
          .then(() => {
            expect(reloadSpyOne.called).to.equal(true);
            expect(reloadSpyTwo.called).to.equal(false);
            fresh8.remove();
          });
      });
    });

    describe('destroyAllAds', () => {
      it('Should call the destroy method on each ad that is currently active', () => {
        const fresh8 = new Fresh8({ instID: '123' });
        const destroySpyOne = sinon.spy();
        const destroySpyTwo = sinon.spy();

        fresh8.ads = [
          { active: true, destroy: destroySpyOne },
          { active: false, destroy: destroySpyTwo }
        ];

        return fresh8
          .destroyAllAds()
          .then(() => {
            expect(destroySpyOne.called).to.equal(true);
            expect(destroySpyTwo.called).to.equal(false);
            fresh8.remove();
          });
      });
    });

    describe('_onCreativeLoaded', () => {
      it('Should set a factory on eact add that matches the creative ref and ', () => {
        const fresh8 = new Fresh8({ instID: '123' });
        const creativeFactorySpy = sinon.spy();
        const setCreativeFactorySpyOne = sinon.spy();
        const callCreativeFactorySpyOne = sinon.spy();
        const setCreativeFactorySpyTwo = sinon.spy();
        const callCreativeFactorySpyTwo = sinon.spy();

        fresh8.ads = [
          {
            active: true,
            awaitingFactory: true,
            creativeRef: '1',
            destroy: () => {},
            _setCreativeFactory: setCreativeFactorySpyOne,
            _callCreativeFactory: callCreativeFactorySpyOne
          },
          {
            active: true,
            awaitingFactory: false,
            creativeRef: '1',
            destroy: () => {},
            _setCreativeFactory: setCreativeFactorySpyTwo,
            _callCreativeFactory: callCreativeFactorySpyTwo
          }
        ];

        fresh8._onCreativeLoaded({ creativeFactory: creativeFactorySpy, creativeRef: '1' });

        expect(setCreativeFactorySpyOne.called).to.equal(true);
        expect(callCreativeFactorySpyOne.called).to.equal(true);

        fresh8.remove();
      });
    });
  });
});
