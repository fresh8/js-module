import {
  requestAdData,
  checkStatusCode,
  parseJSON,
  constructRequestURL,
  vaildateRequestAdConf
} from 'src/api';

import { mockFetchResponse } from '../../lib/mock-fetch';

describe('src/api/index.js', () => {
  describe('requestAdData', () => {
    it('Should make a request to the API with the config passed', () => {
      const body = { '54ad56a213fe19232b646047': { instances: [ { data: {}, env: {} } ] } };
      const fetchStub = sinon.stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(mockFetchResponse(body)));

      const config = { window, endpoint: 'https://fresh8.co/123/raw', slotID: '123' };
      return requestAdData(config)
        .then(response => {
          fetchStub.restore();
          expect(response).to.deep.equal(body);
        });
    });
  });

  describe('checkStatusCode', () => {
    it('Should rejecte the promise if the status is not >= 200 and < 300', done => {
      checkStatusCode({ status: 500 })
        .catch(reason => {
          expect(reason).to.equal('Server returned error: 500');
          done();
        });
    });

    it('Should return the response if status is >= 200 and < 300', () => {
      expect(checkStatusCode({ status: 200 })).to.deep.equal({ status: 200 });
    });
  });

  describe('parseJSON', () => {
    it('Should call json fn if response is defined', () => {
      const jsonSpy = sinon.spy();
      const response = {
        json: jsonSpy
      };

      parseJSON(response);
      expect(jsonSpy.called).to.equal(true);
    });

    it('Should\'t call json fn if response isn\'t defined', () => {
      expect(parseJSON).to.not.throw(Error);
    });
  });

  describe('vaildateRequestAdConf', () => {
    it('Should throw an erorr if no "endpoint is passed', () => {
      expect(vaildateRequestAdConf).to.throw(Error, 'Missing "endpoint"');
    });

    it('Should throw an erorr if no "slotID" is passed', () => {
      expect(() => vaildateRequestAdConf({ endpoint: 'https://fresh8.co/123/raw' })).to.throw(Error, 'Missing "slotID"');
    });

    it('Should throw an erorr if no "window" is passed', () => {
      expect(() => vaildateRequestAdConf({ endpoint: 'https://fresh8.co/123/raw', slotID: '123' })).to.throw(Error, 'Missing "window"');
    });

    it('Should add default values', () => {
      const conf = vaildateRequestAdConf({ window, slotID: '123', endpoint: 'https://fresh8.co/123/raw' });
      expect(conf.competitorIDs).to.deep.equal([]);
      expect(conf.competitors).to.deep.equal([]);
      expect(conf.competitionIDs).to.deep.equal([]);
      expect(conf.competitions).to.deep.equal([]);
      expect(conf.shouldBreakOut).to.deep.equal(false);
      expect(conf.inApp).to.deep.equal(false);
      expect(conf.listenOnPushState).to.deep.equal(false);
      expect(conf.listenOnPushState).to.deep.equal(false);
      expect(conf.linkSameWindow).to.deep.equal(false);
    });

    it('Should\'t overwrite config passed', () => {
      const options = {
        window,
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        sport: 'football',
        competitorIDs: ['5412'],
        competitors: ['Manchester United', 'Southampton'],
        competitionIDs: ['1245'],
        competitions: ['Premier League'],
        listenOnPushState: true,
        linkSameWindow: true,
        inApp: true,
        shouldBreakOut: true
      };

      const conf = vaildateRequestAdConf(options);
      expect(conf).to.deep.equal(options);
    });

    it('Should throw an error if competitors is passed and no sport', () => {
      const options = {
        window,
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        competitors: ['Manchester United', 'Southampton']
      };

      expect(() => vaildateRequestAdConf(options)).to.throw('Sport is required if "competitions" or "competitors" is passed through in the config');
    });

    it('Should throw an error if competitions is passed and no sport', () => {
      const options = {
        window,
        endpoint: 'https://fresh8.co/123/raw',
        slotID: '123',
        competitions: ['Premier League']
      };

      expect(() => vaildateRequestAdConf(options)).to.throw('Sport is required if "competitions" or "competitors" is passed through in the config');
    });
  });

  describe('constructRequestURL', () => {
    it('Should return constructed URL', () => {
      const URL = constructRequestURL('https://fresh8.co/123/raw');
      expect(URL).to.equal('https://fresh8.co/123/raw?');
    });

    it('Should return constructed URL when options passed', () => {
      const options = {
        inApp: true,
        linkSameWindow: true,
        competitorIds: ['1443', '5677'],
        competitors: ['preston'],
        competitionIds: ['125454'],
        competitions: ['Premier League']
      };

      const URL = constructRequestURL('https://fresh8.co/123/raw', options);
      expect(URL).to.equal('https://fresh8.co/123/raw?inApp=true&linkSameWindow=true&competitorIds=1443,5677&competitors=preston&competitionIds=125454&competitions=Premier%20League&');
    });

    it('Should skip empty arrays', () => {
      const options = {
        inApp: true,
        competitorIds: []
      };

      const URL = constructRequestURL('https://fresh8.co/123/raw', options);
      expect(URL).to.equal('https://fresh8.co/123/raw?inApp=true&');
    });
  });
});
