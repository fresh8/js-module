import { invaildeConfig } from 'src/errors.js';

describe('src/errors.js', () => {
  describe('invaildeConfig', () => {
    it('Should return an \'Error\' with the correct name and message', () => {
      const error = invaildeConfig('test message');
      expect(error instanceof Error).to.equal(true);
      expect(error.message).to.equal('test message');
      expect(error.name).to.equal('invaildeConfig');
    });
  });
});
