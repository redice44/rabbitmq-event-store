const { Model } = require('objection');

module.exports = class Event extends Model {
  static get tableName() {
    return 'events';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'exchange',
        'routing_key',
        'timestamp'
      ],
      properties: {
        id: { type: 'string' },
        exchange: { type: 'string' },
        routing_key: { type: 'string' },
        timestamp: { type: 'number' },
        content_type: { type: 'string' },
        content_encoding: { type: 'string' },
        simple_message: { type: 'string' }
      }
    }
  }
};
