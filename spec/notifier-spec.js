var notifier = require('../');

describe('initialization', function () {
  it('should fail if no package is provided', function () {
    (function () {
      notifier(null);
    }).should.throw;
  });

  it('should fail when statusUrl is not provided', function () {
    (function () {
      notifier({ pkg: {} });
    }).should.throw;
  });
});
