const knex = require('knex');
const objection = require('objection');
const dbConfig = require('../knexfile')[process.env.NODE_ENV || 'development'];

module.exports = () => {
  const db = knex(dbConfig);
  objection.Model.knex(db);
  return require('./models');
};
