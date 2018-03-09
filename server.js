'use strict';

/**
 * Module dependencies.
 */
process.on('unhandledRejection', (reason, promise) => {
  console.log('Reason: ' + reason);
  console.log(promise);
});

var app = require('./config/lib/app');
var server = app.start();
