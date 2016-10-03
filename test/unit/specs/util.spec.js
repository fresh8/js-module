import {
  getWindow,
  getRef,
  buildQueryString,
  checkStatusCode,
  parseJSON,
  bindf8ToWindow,
  injectScriptFactory,
  vaildateConfig,
  vaildateRequestAdConf
} from 'src/util.js';

describe('src/util.js', () => {
  describe('getWindow', () => {
    it('should return the current "window" if should break is false', () => {
      const currentWindow = getWindow(false);
      expect(currentWindow).to.deep.equal(window);
    });

    it('should return the "window.parent" if should break is true', () => {
      const currentWindow = getWindow(true);
      expect(currentWindow).to.deep.equal(window.parent);
    });
  });

  describe('getRef', () => {
    it('Should return the "window.location.href" if a canonical link tag isn\'t defined', () => {
      const ref = getRef(window, false);
      expect(ref).to.equal('http%3A%2F%2Flocalhost%3A9876%2Fcontext.html');
    });

    it('Should return the canonical link tag href if it\'s defined on the page', () => {
      const linkTag = document.createElement('link');
      linkTag.rel = 'canonical';
      linkTag.href = 'http://fresh8gaming.com';
      document.body.appendChild(linkTag);

      const ref = getRef(window, false);
      expect(ref).to.equal('http%3A%2F%2Ffresh8gaming.com%2F');

      linkTag.parentNode.removeChild(linkTag);
    });

    it('Should ignore link tags that don\'t have "canonical" rel set', () => {
      const linkTag = document.createElement('link');
      linkTag.href = 'http://fresh8gaming.com';
      document.body.appendChild(linkTag);

      const ref = getRef(window, false);
      expect(ref).to.equal('http%3A%2F%2Flocalhost%3A9876%2Fcontext.html');

      linkTag.parentNode.removeChild(linkTag);
    });

    it('Should return the "about:black" if inApp is set to true', () => {
      const ref = getRef(window, true);
      expect(ref).to.equal('about:blank');
    });

    it('Should return the "userOverrideRef" URL encoded if defined', () => {
      const ref = getRef(window, false, 'http://fresh8gaming.com');
      expect(ref).to.equal('http%3A%2F%2Ffresh8gaming.com');
    });
  });

  describe('buildQueryString', () => {
    it('Should take a object and encode each the key values to "?key=val&keyTwo=valTwo"', () => {
      const queryString = buildQueryString({ team: 'Preston', sport: 'football' });
      expect(queryString).to.equal('?team=Preston&sport=football&');
    });

    it('Should join arrays with commas', () => {
      const queryString = buildQueryString({ team: ['Preston', 'Bristol'] });
      expect(queryString).to.equal('?team=Preston,Bristol&');
    });

    it('Should\'t join empty arrays with commas', () => {
      const queryString = buildQueryString({ team: [] });
      expect(queryString).to.equal('?');
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

  describe('bindf8ToWindow', () => {
    it('Should bind the "__f8" object to the window', () => {
      bindf8ToWindow('1.0.0', window);
      expect(window.__f8['1.0.0']).to.be.a('object');
      delete window.__f8;
    });

    it('Should\'t overwrite an existing "__f8" object', () => {
      window.__f8 = { team: 'preston' };
      bindf8ToWindow('1.0.0', window);
      expect(window.__f8.team).to.equal('preston');
      delete window.__f8;
    });

    it('Should\'t overwrite an existing "__f8[version]" object', () => {
      window.__f8 = { '1.0.0': { team: 'preston' } };
      bindf8ToWindow('1.0.0', window);
      expect(window.__f8['1.0.0'].team).to.equal('preston');
      delete window.__f8;
    });

    describe('setUndefinedProperty', () => {
      it('Should return the value of a key if it exists', () => {
        bindf8ToWindow('1.0.0', window);
        window.__f8['1.0.0'].team = 'preston';
        const value = window.__f8['1.0.0'].setUndefinedProperty('team', 'manchester');
        expect(value).to.equal('preston');
        delete window.__f8;
      });

      it('Should set a value if it doesn\'t exist', () => {
        bindf8ToWindow('1.0.0', window);
        const value = window.__f8['1.0.0'].setUndefinedProperty('team', 'manchester');
        expect(value).to.equal('manchester');
        delete window.__f8;
      });

      it('Should call the value if it\'s function and set the returned value', () => {
        bindf8ToWindow('1.0.0', window);
        const value = window.__f8['1.0.0'].setUndefinedProperty('team', () => { return 'manchester'; });
        expect(value).to.equal('manchester');
        delete window.__f8;
      });

      it('Should throw an error if a key passed and it doesn\'t exist', () => {
        bindf8ToWindow('1.0.0', window);
        expect(() => { window.__f8['1.0.0'].setUndefinedProperty('team'); }).to.throw(Error, 'Trying to access f8 v1.0.0 property team, but its not defined');
        delete window.__f8;
      });
    });
  });

  describe('injectScriptFactory', () => {
    it('Should append a script tag to the page with the passed src', () => {
      injectScriptFactory('test.js');
      const scriptTags = window.document.getElementsByTagName('script');
      const srcs = [];

      for (var i = 0; i < scriptTags.length; i++) {
        srcs.push(scriptTags[i].src);
      }

      expect(srcs).to.deep.contain('http://localhost:9876/test.js');
    });
  });

  describe('vaildateRequestAdConf', () => {
    it('Should throw an erorr if no "slotID" is passed', () => {
      expect(vaildateRequestAdConf).to.throw(Error, 'Missing "slotID"');
    });

    it('Should throw an erorr if no "appendPoint" is passed', () => {
      expect(() => vaildateRequestAdConf({ slotID: '123' })).to.throw(Error, 'Missing "appendPoint"');
    });

    it('Should add default values', () => {
      const conf = vaildateRequestAdConf({ slotID: '123', appendPoint: 'body' });
      expect(conf.competitorIDs).to.deep.equal([]);
      expect(conf.competitors).to.deep.equal([]);
      expect(conf.competitionIDs).to.deep.equal([]);
      expect(conf.competitions).to.deep.equal([]);
    });

    it('Should\'t overwrite config passed', () => {
      const options = {
        slotID: '123',
        appendPoint: 'body',
        sport: 'football',
        competitorIDs: ['5412'],
        competitors: ['Manchester United', 'Southampton'],
        competitionIDs: ['1245'],
        competitions: ['Premier League']
      };

      const conf = vaildateRequestAdConf(options);
      expect(conf).to.deep.equal(options);
    });

    it('Should throw an error if competitors is passed and no sport', () => {
      const options = {
        slotID: '123',
        appendPoint: 'body',
        competitors: ['Manchester United', 'Southampton']
      };

      expect(() => vaildateRequestAdConf(options)).to.throw('Sport is required if "competitions" or "competitors" is passed through in the config');
    });

    it('Should throw an error if competitions is passed and no sport', () => {
      const options = {
        slotID: '123',
        appendPoint: 'body',
        competitions: ['Premier League']
      };

      expect(() => vaildateRequestAdConf(options)).to.throw('Sport is required if "competitions" or "competitors" is passed through in the config');
    });
  });

  describe('vaildateConfig', () => {
    it('Should throw an error if no "instID" is passed', () => {
      expect(vaildateConfig).to.throw(Error);
    });

    it('Should add default values', () => {
      const config = vaildateConfig({ instID: '123' });
      expect(config.endpoint).to.equal('https://fresh8.co/123/raw');
      expect(config.inApp).to.equal(false);
      expect(config.shouldBreakOut).to.equal(false);
    });

    it('Should\'t overwrite config passed', () => {
      const config = vaildateConfig({
        instID: '123',
        endpoint: 'http://fresh8gaming.com',
        inApp: true,
        shouldBreakOut: true
      });

      expect(config.endpoint).to.equal('http://fresh8gaming.com');
      expect(config.inApp).to.equal(true);
      expect(config.shouldBreakOut).to.equal(true);
    });
  });
});
