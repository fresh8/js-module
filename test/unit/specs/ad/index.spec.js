import Ad, { vaildateConfig } from 'src/ad';
import { mockFetchResponse } from '../../lib/mock-fetch';
import { removeScriptTag } from '../../lib/remove-script-tag';

describe('src/ad/index.js', () => {
  describe('Ad', () => {
    it('Should return a new instance of the class when initialised', () => {
      const config = {
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        appendPoint: 'body',
        creativeFactoryCache: {},
        window: {}
      };

      const ad = new Ad(config);
      expect(ad).to.be.instanceOf(Ad);
    });

    it('Should throw an error if no config is passed', () => {
      expect(() => { Ad(); }).to.throw(Error);
    });

    describe('load', () => {
      it('Should call the creative factory if set', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const fetchStub = sinon.stub(window, 'fetch');
        const body = {
          '54ad56a213fe19232b646047': {
            creativePath: 'creative-factory.js',
            CSSPath: 'test.css',
            instances: [ { data: {}, env: {} } ]
          }
        };

        const ad = new Ad(config);

        fetchStub.returns(Promise.resolve(mockFetchResponse(body)));
        ad.awaitingFactory = false;

        const callCreativeFactoryStub = sinon.stub(ad, '_callCreativeFactory');
        callCreativeFactoryStub.returns(Promise.resolve());

        // Simulate a network request injecting a creative factory
        setTimeout(() => {
          ad.loadResolvers.resolve(ad);
        }, 500);

        return ad
          .load()
          .then(() => {
            expect(callCreativeFactoryStub.called).to.equal(true);

            fetchStub.restore();
            callCreativeFactoryStub.restore();
            removeScriptTag('http://localhost:9876/creative-factory.js');
          });
      });

      it('Should set the ad "active" to false if request fails', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const fetchStub = sinon.stub(window, 'fetch');
        const ad = new Ad(config);
        fetchStub.returns(Promise.reject(new Error('404')));

        return ad
          .load()
          .catch(() => {
            expect(ad.active).to.equal(false);
            fetchStub.restore();
          });
      });

      it('Should make a request and inject factory script if it\'s not cached', done => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const fetchStub = sinon.stub(window, 'fetch');
        const body = {
          '54ad56a213fe19232b646047': {
            creativePath: 'creative-factory.js',
            CSSPath: 'test.css',
            instances: [ { data: {}, env: {} } ]
          }
        };

        fetchStub.returns(Promise.resolve(mockFetchResponse(body)));
        const ad = new Ad(config);

        // Simulate a network request injecting a creative factory
        setTimeout(() => {
          ad.loadResolvers.resolve(ad);
        }, 500);

        ad
          .load()
          .then(() => {
            const scriptTags = window.document.getElementsByTagName('script');
            const srcs = [];

            expect(ad.creativeRef).to.equal('54ad56a213fe19232b646047');
            expect(ad.CSSPath).to.equal('test.css');
            expect(ad.data).to.deep.equal({ appendPoint: 'body' });
            expect(ad.env).to.deep.equal({});
            expect(ad.creativePath).to.equal('creative-factory.js');
            expect(ad.selector).to.equal('body .f854ad56a213fe19232b646047');

            for (var i = 0; i < scriptTags.length; i++) {
              srcs.push(scriptTags[i].src);
            }

            expect(srcs).to.deep.contain('http://localhost:9876/creative-factory.js');

            fetchStub.restore();
            removeScriptTag('http://localhost:9876/creative-factory.js');
            done();
          });
      });
    });

    describe('reload', () => {
      it('Should request new data and set it in the class', done => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const fetchStub = sinon.stub(window, 'fetch');
        const body = {
          '54ad56a213fe19232b646047': {
            creativePath: 'creative-factory.js',
            CSSPath: 'test.css',
            instances: [ { data: {}, env: {} } ]
          }
        };

        fetchStub.returns(Promise.resolve(mockFetchResponse(body)));
        const ad = new Ad(config);
        ad._callCreativeFactory = function () { };
        ad.destroy = function () { };
        ad.creativeRef = '54ad56a213fe19232b646047';

        // Simulate a network request injecting a creative factory
        setTimeout(() => {
          ad.loadResolvers.resolve(ad);
        }, 500);

        ad
          .reload()
          .then(() => {
            expect(ad.data).to.deep.equal({ appendPoint: 'body' });
            expect(ad.env).to.deep.equal({});
            expect(ad.CSSPath).to.equal('test.css');
            expect(ad.selector).to.equal('body .f854ad56a213fe19232b646047');

            fetchStub.restore();
            removeScriptTag('http://localhost:9876/creative-factory.js');
            done();
          });
      });

      it('Should switch ad type if creative ref changes', done => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const fetchStub = sinon.stub(window, 'fetch');
        const body = {
          '54ad56a213fe19232b646047': {
            creativePath: 'creative-factory.js',
            CSSPath: 'test.css',
            instances: [ { data: {}, env: {} } ]
          }
        };

        fetchStub.returns(Promise.resolve(mockFetchResponse(body)));
        const ad = new Ad(config);
        ad._callCreativeFactory = function () { };
        ad.destroy = function () { };

        const switchAdTypeStub = sinon.stub(ad, '_switchAdType');
        switchAdTypeStub.returns(function () {});
        ad.creativeRef = '54ad56a213fe19232b646067';

        // Simulate a network request injecting a creative factory
        setTimeout(() => {
          ad.loadResolvers.resolve(ad);
        }, 500);

        ad
          .reload()
          .then(() => {
            expect(switchAdTypeStub.called).to.equal(true);
            switchAdTypeStub.restore();
            fetchStub.restore();
            removeScriptTag('http://localhost:9876/creative-factory.js');
            done();
          });
      });
    });

    describe('destroy', () => {
      it('Should distroy the ad instance and remove it from the DOM', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const div = document.createElement('div');
        div.id = 'test-el';
        document.body.appendChild(div);

        const adInstanceSpy = sinon.spy();
        const ad = new Ad(config);
        ad.active = true;
        ad.adInstance = { destroy: adInstanceSpy };
        ad.selector = '#test-el';

        ad.destroy();

        expect(adInstanceSpy.called).to.equal(true);
        expect(ad.active).to.equal(false);
        expect(document.querySelector('#test-el')).to.equal(null);
      });

      it('Shouldn\'t distroy the ad instance if not active', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const adInstanceSpy = sinon.spy();
        const ad = new Ad(config);
        ad.adInstance = { destroy: adInstanceSpy };
        ad.active = false;

        ad.destroy();

        expect(adInstanceSpy.called).to.equal(false);
      });
    });

    describe('_switchAdType', () => {
      it('Should set the creative factory if it exists in the cache', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: { exists: () => true, get: () => true },
          window
        };

        const ad = new Ad(config);
        const setCreativeFactoryStub = sinon.stub(ad, '_setCreativeFactory');
        setCreativeFactoryStub.returns(() => {});
        ad._switchAdType();
        expect(setCreativeFactoryStub.called).to.equal(true);
      });

      it('Should inject ad factory scirpt if not set in cache', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: { exists: () => false },
          window
        };

        const ad = new Ad(config);
        ad.creativePath = 'switch-ad-type-test.js';
        ad._switchAdType();

        const scriptTags = window.document.getElementsByTagName('script');
        const srcs = [];

        expect(ad.awaitingFactory).to.equal(true);

        for (var i = 0; i < scriptTags.length; i++) {
          srcs.push(scriptTags[i].src);
        }

        expect(srcs).to.deep.contain('http://localhost:9876/switch-ad-type-test.js');
        removeScriptTag('http://localhost:9876/switch-ad-type-test.js');
      });
    });

    describe('_setCreativeFactory', () => {
      it('Should set creative factory in class', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const ad = new Ad(config);
        ad._setCreativeFactory('myCreativeFactory');
        expect(ad.awaitingFactory).to.equal(false);
        expect(ad.creativeFactory).to.equal('myCreativeFactory');
      });
    });

    describe('_callCreativeFactory', () => {
      it('Should call the creative factory and set the "adInstance"', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const creativeFactoryStub = sinon.stub();
        creativeFactoryStub.returns(Promise.resolve('myGreatAdInstance'));
        const resolveSpy = sinon.spy();

        const ad = new Ad(config);
        ad.awaitingFactory = false;
        ad.creativeFactory = creativeFactoryStub;
        ad.loadResolvers = { resolve: resolveSpy, reject: Promise.reject };

        return ad
          ._callCreativeFactory()
          .then(() => {
            expect(ad.adInstance).to.equal('myGreatAdInstance');
            expect(ad.active).to.equal(true);
            expect(resolveSpy.called).to.equal(true);
          });
      });

      it('Should reject the "loadResolvers" if creativeFactory returns an error', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const creativeFactoryStub = sinon.stub();
        creativeFactoryStub.returns(Promise.reject());
        const rejectSpy = sinon.spy();

        const ad = new Ad(config);
        ad.awaitingFactory = false;
        ad.creativeFactory = creativeFactoryStub;
        ad.loadResolvers = { resolve: Promise.resolve, reject: rejectSpy };

        return ad
          ._callCreativeFactory()
          .then(() => {
            expect(rejectSpy.called).to.equal(true);
          });
      });

      it('Shouldn\'t call loadResolvers if "awaitingFactory" is true', () => {
        const config = {
          endpoint: 'https://fresh8.co/123/raw',
          slotID: '123',
          appendPoint: 'body',
          creativeFactoryCache: {},
          window
        };

        const ad = new Ad(config);
        const resolveSpy = sinon.spy();
        const rejectSpy = sinon.spy();
        ad.awaitingFactory = true;
        ad.loadResolvers = { resolve: resolveSpy, reject: rejectSpy };

        return ad._callCreativeFactory()
          .then(() => {
            expect(rejectSpy.called).to.equal(false);
            expect(resolveSpy.called).to.equal(false);
          });
      });
    });
  });

  describe('vaildateConfig', () => {
    it('Should throw an error if missing "endpoint"', () => {
      expect(vaildateConfig).to.throw(Error, 'Missing "endpoint"');
    });

    it('Should throw an error if missing "creativeFactoryCache"', () => {
      const config = {
        endpoint: 'https://fresh8.co/123/raw'
      };

      expect(() => { vaildateConfig(config); }).to.throw(Error, 'Missing "creativeFactoryCache"');
    });

    it('Should throw an error if missing "slotID"', () => {
      const config = {
        endpoint: 'https://fresh8.co/123/raw',
        creativeFactoryCache: {}
      };

      expect(() => { vaildateConfig(config); }).to.throw(Error, 'Missing "slotID"');
    });

    it('Should throw an error if missing "appendPoint"', () => {
      const config = {
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        creativeFactoryCache: {}
      };

      expect(() => { vaildateConfig(config); }).to.throw(Error, 'Missing "appendPoint"');
    });

    it('Should throw an error if missing "window"', () => {
      const config = {
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        appendPoint: 'body',
        creativeFactoryCache: {}
      };

      expect(() => { vaildateConfig(config); }).to.throw(Error, 'Missing "window"');
    });

    it('Should return the default values', () => {
      const config = {
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        appendPoint: 'body',
        creativeFactoryCache: {},
        window: {}
      };

      const vaildatedConfig = vaildateConfig(config);
      expect(vaildatedConfig.endpoint).to.equal('https://fresh8.co/123/raw');
      expect(vaildatedConfig.slotID).to.equal('123');
      expect(vaildatedConfig.appendPoint).to.equal('body');
      expect(vaildatedConfig.creativeFactoryCache).to.deep.equal({});
      expect(vaildatedConfig.window).to.deep.equal({});
      expect(vaildatedConfig.inApp).to.equal(false);
      expect(vaildatedConfig.shouldBreakOut).to.equal(false);
      expect(vaildatedConfig.listenOnPushState).to.equal(false);
      expect(vaildatedConfig.competitorIDs).to.deep.equal([]);
      expect(vaildatedConfig.competitors).to.deep.equal([]);
      expect(vaildatedConfig.competitionIDs).to.deep.equal([]);
      expect(vaildatedConfig.competitions).to.deep.equal([]);
    });

    it('Should allow you to overwrite the default config values', () => {
      const config = {
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        appendPoint: 'body',
        creativeFactoryCache: {},
        window: {},
        inApp: true,
        shouldBreakOut: true,
        listenOnPushState: true,
        competitorIDs: ['67654'],
        competitors: ['Manchester United', 'Southampton'],
        competitionIDs: ['234435'],
        competitions: ['Premier League'],
        sport: 'Football'
      };

      const vaildatedConfig = vaildateConfig(config);

      expect(vaildatedConfig.endpoint).to.equal('https://fresh8.co/123/raw');
      expect(vaildatedConfig.slotID).to.equal('123');
      expect(vaildatedConfig.appendPoint).to.equal('body');
      expect(vaildatedConfig.creativeFactoryCache).to.deep.equal({});
      expect(vaildatedConfig.window).to.deep.equal({});
      expect(vaildatedConfig.inApp).to.equal(true);
      expect(vaildatedConfig.shouldBreakOut).to.equal(true);
      expect(vaildatedConfig.listenOnPushState).to.equal(true);
      expect(vaildatedConfig.competitorIDs).to.deep.equal(['67654']);
      expect(vaildatedConfig.competitors).to.deep.equal(['Manchester United', 'Southampton']);
      expect(vaildatedConfig.competitionIDs).to.deep.equal(['234435']);
      expect(vaildatedConfig.competitions).to.deep.equal(['Premier League']);
      expect(vaildatedConfig.sport).to.equal('Football');
    });

    it('Should throw an error if competitors is passed and no sport', () => {
      const options = {
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        appendPoint: 'body',
        creativeFactoryCache: {},
        window: {},
        competitors: ['Manchester United', 'Southampton']
      };

      expect(() => vaildateConfig(options)).to.throw('Sport is required if "competitions" or "competitors" is passed through in the config');
    });

    it('Should throw an error if competitions is passed and no sport', () => {
      const options = {
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        appendPoint: 'body',
        creativeFactoryCache: {},
        window: {},
        competitions: ['Premier League']
      };

      expect(() => vaildateConfig(options)).to.throw('Sport is required if "competitions" or "competitors" is passed through in the config');
    });
  });
});
