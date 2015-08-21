var ConfigStore = require('configstore');
var nock        = require('nock');

var notifier    = require('../');

var testName    = 'Test API';
var config      = new ConfigStore('statuspage-notifier-' + testName.replace(' ', '_'));

describe('notifier', function () {
  describe('initialization', function () {
    it('should fail if no package is provided', function () {
      (function () {
        notifier(null);
      }).should.throw;
    });

    it('should fail when apiUrl is not provided', function () {
      (function () {
        notifier({ name: 'test' });
      }).should.throw;
    });

    it('should fail when pageUrl is not provided', function () {
      (function () {
        notifier({ name: 'test', apiUrl: 'test' });
      }).should.throw;
    });

    it('should expose the notify method', function () {
      var testNotifier = notifier({
        name: 'Test',
        apiUrl: 'http://test.io/api',
        pageUrl: 'http://status.test.io'
      });

      testNotifier.notify.should.exist;
      testNotifier.notify.should.be.a.function;
    });
  });

  describe('notification', function () {
    var testNotifier = notifier({
      name: 'Test API',
      apiUrl: 'http://example.com/api/',
      pageUrl: 'http://example.com/'
    });

    before(function () {
      nock('http://example.com/api/')
        .get('/')
        .times(2)
        .reply(200, { status: { description: 'Test operational' } });
    });

    it('should get status', function () {
      (function () {
        testNotifier.notify();
      }).should.not.throw;
    });

    it('should store the most recent check', function (done) {
      testNotifier.notify();

      setTimeout(function () {
        var last =  config.get('lastupdate');

        if (last) {
          last = last.toString().substring(0, last.length - 2);
          last.should.equal(Date.now().toString().substring(0, last.length - 2));
        }

        done();
      }, 1);
    });
  });
});
