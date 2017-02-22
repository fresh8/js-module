import Cache from 'src/cache';

describe('src/cache/index.js', () => {
  describe('Cache', () => {
    it('Should set a value in the cache store on "put"', () => {
      const cache = new Cache();
      cache.put('test', 'fresh8');
      expect(cache.cache.test).to.equal('fresh8');
    });

    it('Should removed a key/value from the cache on "remove"', () => {
      const cache = new Cache();
      cache.put('test', 'fresh8');
      expect(cache.cache.test).to.equal('fresh8');
      cache.remove('test');
      expect(cache.cache.test).to.equal(undefined);
    });

    it('Shouldn\'t error if key/value doesn\'t exist on "remove"', () => {
      const cache = new Cache();
      expect(() => { cache.remove('test'); }).to.not.throw(Error);
    });

    it('Should return the value of key if it exists on "get"', () => {
      const cache = new Cache();
      cache.put('test', 'fresh8');
      expect(cache.get('test')).to.equal('fresh8');
    });

    it('Should return true if a value exists for a key on "exists"', () => {
      const cache = new Cache();
      cache.put('test', 'fresh8');
      expect(cache.exists('test')).to.equal(true);
    });

    it('Should return true if a value exists for a key on "exists"', () => {
      const cache = new Cache();
      expect(cache.exists('test')).to.equal(false);
    });
  });
});
