'use strict';
require('rootpath')();
/**
 * Module dependencies.
 */
var _ = require('lodash'),
  chalk = require('chalk'),
  cassandra = require('express-cassandra');

let runCassandra = async() => {
  return new Promise((resolve, reject) => {
    cassandra.setDirectory('cassandra/models').bind(
     {
       clientOptions: {
         contactPoints: ['127.0.0.1'],
         protocolOptions: { port: 9042 },
         keyspace: 'fmf',
         queryOptions: { consistency: cassandra.consistencies.one }
       },
       ormOptions: {
         defaultReplicationStrategy: {
           class: 'SimpleStrategy',
           replication_factor: 1
         },
         migration: 'safe'
       }
     },
       err => {
         if (err) {
           console.log(err);
           throw err;
         } else {
           console.log(chalk.yellow('Cassandra tables migrated!'));
         }

       // You'll now have a `person` table in cassandra created against the model
       // schema you've defined earlier and you can now access the model instance
       // in `models.instance.Person` object containing supported orm operations.
       }
   );    
  })

}


var User = cassandra.instance.Users;
console.log(User);
