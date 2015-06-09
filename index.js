var http        = require('http');
var url         = require('url');

var concat      = require('concat-stream');
var ConfigStore = require('configstore');

module.exports = function (options) {
  if (!options || !options.name) throw new Error('name is required.');
  if (!options.statusUrl) throw new Error('statusUrl is required');

  var config = new ConfigStore('statuspage-notifier-' + options.name.replace(' ', '_'));
  var surl = url.parse(options.statusUrl);

  return {
    notify: function () {
      var lastUpdate = config.get('lastupdate');
      if (lastUpdate && options.checkInterval) {
        lastUpdate = new Date(lastUpdate);

        if ((Date.now() - lastUpdate) < options.checkInterval) {
          return;
        }
      }

      http.request({
        hostname : surl.hostname,
        path     : surl.path,
        method   : 'GET'
      },
      function (res) {
        res.pipe(concat(function (response) {
          try {
            response = JSON.parse(response.toString());
          } catch (err) {
            return;
          }

          config.set('lastupdate', Date.now());
          console.log(options.name + ' status:');
          console.log(response.status.description);
        }));
      }).end();
    }
  };
};
