'use strict';
require('dotenv').config();
require('rootpath')();

const cassandra = require('express-cassandra'),
  chalk = require('chalk');

exports.runCassandra = () => {
  console.log('runnning cassandra');
  return new Promise((resolve, reject) => {
    cassandra.setDirectory('cassandra/models').bind(
    {
      clientOptions: {
        contactPoints: [process.env.CONTACT_POINTS],
        protocolOptions: { port: process.env.DB_PORT },
        keyspace: process.env.KEYSPACE,
        queryOptions: { consistency: cassandra.consistencies.one }
      },
      ormOptions: {
        defaultReplicationStrategy: {
          class: process.env.STRATEGY,
          replication_factor: process.env.REP_FACTOR
        },
        migration: 'safe'
      }
    },
      err => {
        if (err) {
          reject(err);
        } else {
          console.log(chalk.yellow('Cassandra tables migrated!'));
          resolve();
        }

      // You'll now have a `person` table in cassandra created against the model
      // schema you've defined earlier and you can now access the model instance
      // in `models.instance.Person` object containing supported orm operations.
      }
    );
  });
};
