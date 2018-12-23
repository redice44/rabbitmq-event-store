const tableName = 'events';

module.exports.up = knex => knex.schema.createTable(tableName, table => {
  table.uuid('id')
    .unique()
    .defaultTo(knex.raw('uuid_generate_v4()'));
  table.string('exchange')
    .notNullable();
  table.string('routing_key')
    .notNullable();
  table.bigInteger('timestamp')
    .notNullable();
  table.string('content_type')
    .defaultTo(null);
  table.string('content_encoding')
    .defaultTo(null);
});

module.exports.down = knex => knex.schema.dropTable(tableName);
