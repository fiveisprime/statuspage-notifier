var notifier = require('..')({
  name: 'Modulus',
  checkInterval: 1000,
  apiUrl: 'http://yzskf90qzqff.statuspage.io/api/v2/summary.json',
  pageUrl: 'http://status.modulus.io'
});

notifier.notify();
