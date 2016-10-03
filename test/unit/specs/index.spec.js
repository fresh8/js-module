import Fresh8 from 'src/index.js';
import { mockFetchResponse } from '../lib/mock-fetch';

describe('src/index.js', () => {
  describe('Fresh8', () => {
    it('Should return a new instance of the class when initialised', () => {
      const fresh8 = new Fresh8({ instID: '123' });
      expect(fresh8).to.be.instanceOf(Fresh8);
      fresh8.remove();
    });

    describe('requestAd', () => {
      it('Should throw error if no options are passed', done => {
        const fresh8 = new Fresh8({ instID: '123' });

        fresh8
          .requestAd()
          .catch(reason => {
            expect(reason.name).to.equal('invaildeConfig');
            expect(reason.message).to.equal('Missing "slotID"');
            fresh8.remove();
            done();
          });
      });

      it('Should make a request for the ad with the options passed', done => {
        const fetchStub = sinon.stub(window, 'fetch');
        const body = { '54ad56a213fe19232b646047': { instances: [ { data: {}, env: {} } ] } };

        fetchStub.returns(Promise.resolve(mockFetchResponse(body)));

        const fresh8 = new Fresh8({ instID: '123' });
        const loadAdStub = sinon.spy(fresh8, '_loadAd');
        const constructRequestUrlStub = sinon.stub(fresh8, '_constructRequestURL');

        constructRequestUrlStub.returns('http://fresh8gaming.com');
        fresh8.creativeFactoryCache['54ad56a213fe19232b646047'] = () => {};

        fresh8
          .requestAd({ slotID: '312', appendPoint: 'body' })
          .then(() => {
            expect(constructRequestUrlStub.called).to.equal(true);
            expect(loadAdStub.called).to.equal(true);
            expect(fetchStub.called).to.equal(true);

            constructRequestUrlStub.restore();
            fetchStub.restore();
            fresh8.remove();
            done();
          });
      });

      it('Should make a request and inject factory script if it\'s not cached', done => {
        const fetchStub = sinon.stub(window, 'fetch');
        const body = { '54ad56a213fe19232b646047': { creativePath: 'test.js', instances: [ { data: {}, env: {} } ] } };

        fetchStub.returns(Promise.resolve(mockFetchResponse(body)));

        const fresh8 = new Fresh8({ instID: '123' });
        const constructRequestUrlStub = sinon.stub(fresh8, '_constructRequestURL');

        constructRequestUrlStub.returns('http://fresh8gaming.com');

        // Simulate a network request
        setTimeout(() => {
          const scriptLoadedEvent = new Event('__f8-creative-script-loaded');
          scriptLoadedEvent.creativeFactory = () => {};
          scriptLoadedEvent.creativeRef = '54ad56a213fe19232b646047';
          window.dispatchEvent(scriptLoadedEvent);
        }, 100);

        fresh8
          .requestAd({ slotID: '312', appendPoint: 'body' }).catch(reason => { console.log('reason', reason); })
          .then(() => {
            expect(constructRequestUrlStub.called).to.equal(true);

            constructRequestUrlStub.restore();
            fetchStub.restore();
            fresh8.remove();
            done();
          });
      });
    });

    describe('_lookUpAdData', () => {
      it('Should match on payloads object key', () => {
        const adData = {
          payload: {
            '54ad56a213fe19232b646047': { instances: [ { data: {}, env: {} } ] }
          },
          appendPoint: 'body',
          resolve: () => { },
          reject: () => { }
        };

        const fresh8 = new Fresh8({ instID: '123' });
        fresh8.adDataCache = [ adData ];

        const { ad, index } = fresh8._lookUpAdData('54ad56a213fe19232b646047');
        expect(ad).to.deep.equal(adData);
        expect(index).to.deep.equal(0);
        fresh8.remove();
      });

      it('Should return an empty object if payload object key can\'t be matched', () => {
        const adData = {
          payload: {
            '54ad56a213fe19232b646047': { instances: [ { data: {}, env: {} } ] }
          },
          appendPoint: 'body',
          resolve: () => { },
          reject: () => { }
        };

        const fresh8 = new Fresh8({ instID: '123' });
        fresh8.adDataCache = [ adData ];

        const matchedData = fresh8._lookUpAdData('notfound');
        expect(matchedData).deep.equal({});
        fresh8.remove();
      });
    });

    describe('_loadAd', () => {
      it('Should call the creative factory if found', () => {
        const factorySpy = sinon.spy();
        const fresh8 = new Fresh8({ instID: '123' });
        const lookUpAdDataStub = sinon.stub(fresh8, '_lookUpAdData');
        const adData = {
          payload: {
            '54ad56a213fe19232b646047': { instances: [ { data: {}, env: {} } ] }
          },
          appendPoint: 'body',
          resolve: () => { },
          reject: () => { }
        };

        lookUpAdDataStub.returns({ ad: adData, index: 0 });
        fresh8.adDataCache = [ adData ];
        fresh8._loadAd(factorySpy, '54ad56a213fe19232b646047');
        expect(factorySpy.called).to.equal(true);

        lookUpAdDataStub.restore();
        fresh8.remove();
      });

      it('Should\'t call the creative factory not found', () => {
        const factorySpy = sinon.spy();
        const fresh8 = new Fresh8({ instID: '123' });
        const lookUpAdDataStub = sinon.stub(fresh8, '_lookUpAdData');
        const adData = null;

        lookUpAdDataStub.returns({ ad: adData, index: 0 });
        fresh8.adDataCache = [ adData ];
        fresh8._loadAd(factorySpy, '54ad56a213fe19232b646047');
        expect(factorySpy.called).to.equal(false);

        lookUpAdDataStub.restore();
        fresh8.remove();
      });
    });

    describe('_addEventLisnter', () => {
      it('Should bind "__f8-creative-script-loaded" to window', () => {
        const factorySpy = sinon.spy();
        const fresh8 = new Fresh8({ instID: '123' });
        const loadAdStub = sinon.stub(fresh8, '_loadAd');
        loadAdStub.returns();

        const scriptLoadedEvent = new Event('__f8-creative-script-loaded');
        scriptLoadedEvent.creativeFactory = factorySpy;
        scriptLoadedEvent.creativeRef = '54ad56a213fe19232b646047';
        window.dispatchEvent(scriptLoadedEvent);

        expect(fresh8.creativeFactoryCache).to.deep.equal({ '54ad56a213fe19232b646047': factorySpy });

        loadAdStub.restore();
        fresh8.remove();
      });
    });

    describe('_constructRequestURL', () => {
      it('Should return constructed URL', () => {
        const fresh8 = new Fresh8({ instID: '123' });
        const URL = fresh8._constructRequestURL();
        expect(URL).to.equal('https://fresh8.co/123/raw?');
        fresh8.remove();
      });

      it('Should return constructed URL when options passed', () => {
        const fresh8 = new Fresh8({ instID: '123' });
        const options = {
          competitorIds: ['1443', '5677'],
          competitors: ['preston'],
          competitionIds: ['125454'],
          competitions: ['Premier League']
        };

        const URL = fresh8._constructRequestURL(options);
        expect(URL).to.equal('https://fresh8.co/123/raw?competitorIds=1443,5677&competitors=preston&competitionIds=125454&competitions=Premier%20League&');
        fresh8.remove();
      });
    });
  });
});
