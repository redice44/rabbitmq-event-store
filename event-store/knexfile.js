const path = require('path');

const baseConnection = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
};

const buildConnectionString = ({ user, password, host, port, database }) =>
  `postgres://${user}:${password}@${host}${port ? `${port}` : ''}/${database}`;

module.exports = {
  development: {
    client: 'pg',
    connection: buildConnectionString({ ...baseConnection }),
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations')
    }
  }
};
