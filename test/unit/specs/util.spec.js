import { removeScriptTag } from '../lib/remove-script-tag';
import {
  getWindow,
  getRef,
  vaildateConfig,
  bindf8ToWindow,
  injectScriptFactory
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
      expect(ref).to.include('context.html');

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
      removeScriptTag('http://localhost:9876/test.js');
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
