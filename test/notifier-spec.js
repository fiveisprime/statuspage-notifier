var Code = require('code');
var ConfigStore = require('configstore');
var Lab = require('lab');
var Nock = require('nock');

var Notifier = require('../');

var testName = 'Test API';
var config = new ConfigStore('statuspage-notifier-' + testName.replace(' ', '_'));

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;

describe('notifier', function () {
  describe('initialization', function () {
    it('should fail if no package is provided', function (done) {
      var throws = function () {
        Notifier(null);
      };

      Code.expect(throws).to.throw();

      done();
    });

    it('should fail when apiUrl is not provided', function (done) {
      var throws = function () {
        Notifier({ name: 'test' });
      };

      Code.expect(throws).to.throw();

      done();
    });

    it('should fail when pageUrl is not provided', function (done) {
      var throws = function () {
        Notifier({ name: 'test', apiUrl: 'test' });
      };

      Code.expect(throws).to.throw();

      done();
    });

    it('should expose the notify method', function (done) {
      var testNotifier = Notifier({
        name: 'Test',
        apiUrl: 'http://test.io/api',
        pageUrl: 'http://status.test.io'
      });

      Code.expect(testNotifier.notify).to.be.a.function();

      done();
    });
  });

  describe('notification', function () {
    var testNotifier = Notifier({
      name: 'Test API',
      apiUrl: 'http://example.com/api/',
      pageUrl: 'http://example.com/'
    });

    before(function (done) {
      Nock('http://example.com/api/')
        .get('/')
        .times(2)
        .reply(200, {
          status: { description: 'Test operational' },
          components: [],
          incidents: []
        });

      done();
    });

    it('should get status', function (done) {
      var throws = function () {
        testNotifier.notify();
      };

      Code.expect(throws).to.not.throw();

      done();
    });

    it('should store the most recent check', function (done) {
      testNotifier.notify();

      setTimeout(function () {
        var last =  config.get('lastupdate');

        if (last) {
          last = last.toString().substring(0, last.length - 2);
          Code.expect(last).to.equal(Date.now().toString().substring(0, last.length - 2));
        }

        done();
      }, 1);
    });
  });
});
