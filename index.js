var http        = require('http');
var url         = require('url');

var chalk       = require('chalk');
var createTable = require('text-table');
var concat      = require('concat-stream');
var ConfigStore = require('configstore');

function writeHeader() {
  console.log(chalk.grey('--------------------------------------------------'));
}

module.exports = function (options) {
  if (!options || !options.name) throw new Error('name is required.');
  if (!options.apiUrl) throw new Error('apiUrl is required');
  if (!options.pageUrl) throw new Error('pageUrl is required');

  var config = new ConfigStore('statuspage-notifier-' + options.name.replace(' ', '_'));
  var surl = url.parse(options.apiUrl);

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
          var table = [];

          try {
            response = JSON.parse(response.toString());
          } catch (err) {
            return;
          }

          config.set('lastupdate', Date.now());

          response.components.forEach(function (component) {
            if (component.status === 'operational') {
              table.push([
                chalk.grey(component.name + ': '),
                chalk.green(component.status.replace('_', ' '))
              ]);
            } else {
              table.push([
                chalk.grey(component.name + ': '),
                chalk.red(component.status.replace('_', ' '))
              ]);
            }
          });

          writeHeader();
          console.log(chalk.white(options.name + ' status'));
          writeHeader();
          console.log(createTable(table));
          writeHeader();
          if (response.incidents.length === 0) {
            console.log(chalk.green('No open incidents'));
          } else {
            var incidentMessage = 'There';

            if (response.incidents.length === 1) {
              incidentMessage += ' is 1 open incident';
            } else {
              incidentMessage += ' are ' + response.incidents.length + ' open incidents';
            }

            console.log(chalk.red(incidentMessage));
            response.incidents.forEach(function (incident) {
              console.log(incident.name);
            });
          }
          writeHeader();
          console.log('View full details at ' + chalk.blue(options.pageUrl));
        }));
      }).end();
    }
  };
};
