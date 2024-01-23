'use strict';

const Env = use('Env');

module.exports = {
  connection: Env.get('DB_CONNECTION', 'mysql'),

  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('DB_HOST', '127.0.0.1'),
      port: Env.get('DB_PORT', '3306'),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis'),
    },
    debug: Env.get('DB_DEBUG', false),
  },
};
