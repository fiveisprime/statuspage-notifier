# statuspage-notifier

[![npm version](https://badge.fury.io/js/statuspage-notifier.svg)](http://badge.fury.io/js/statuspage-notifier) [![Code Climate](https://codeclimate.com/github/fiveisprime/statuspage-notifier/badges/gpa.svg)](https://codeclimate.com/github/fiveisprime/statuspage-notifier) [![Test Coverage](https://codeclimate.com/github/fiveisprime/statuspage-notifier/badges/coverage.svg)](https://codeclimate.com/github/fiveisprime/statuspage-notifier/coverage)

Supply the publicly accessible status URL for your statuspage.io account, the
interval at which to check, and the contents of your package.json.

# Usage

Initialize the notifier with the following options

*`name`*: Name of your service. This will be output as the header for the status

*`checkInterval`*: Minimum time between displaying the status

*`apiUrl`*: URL of your statuspage API

*`pageUrl`*: URL of your statuspage page


```js
var notifier = require('statuspage-notifier')({
  name          : 'My API',
  checkInterval : 1 * 60 * 1000, // Will only run and output once per hour.
  apiUrl        : 'http://yzskf90qzqff.statuspage.io/api/v2/status.json',
  pageUrl       : 'http://status.modulus.io'
});

// Call the notify method as much as you like, the request and output will
// only happen ater the specified internval has elapsed.
notifier.notify();
```

*Example Output*

```shell
--------------------------------------------------
Modulus status
--------------------------------------------------
Web Interface:       operational
API:                 operational
MongoDB:             operational
Balancers:           degraded performance
Stats:               operational
Application Hosts:   operational
--------------------------------------------------
There is 1 open incident
AWS us-east-1a balancer 54.236.216.66 under heavy load
--------------------------------------------------
View full details at http://status.modulus.io
```

Having trouble finding the API URL for your statuspage? Go to `/api` to see the
documentation and URL for your service. :)

Special thanks go to [Francesca Varney](https://github.com/franvarney) for
writing the initial version of the status check.

# License

The MIT License (MIT)

Copyright (c) 2015 Matt Hernandez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

