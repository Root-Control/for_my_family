'use strict';
const path = require('path'),
  cassandra = require(path.resolve('./cassandra/connection'));
/**
 * Module dependencies.
 */
(async() => {
  await cassandra.runCassandra();

  process.on('unhandledRejection', (reason, promise) => {
    console.log('Reason: ' + reason);
    console.log(promise);
  });

  const app = require('./config/lib/app');
  const server = app.start();
})();
