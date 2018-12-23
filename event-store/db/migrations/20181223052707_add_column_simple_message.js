const columnName = 'simple_message';
const tableName = 'events';

module.exports.up = knex => knex.schema.alterTable(tableName, table => {
  table.string(columnName)
    .defaultTo(null);
});

module.exports.down = knex => knex.schema.alterTable(tableName, table => {
  table.dropColumn(columnName);
});
